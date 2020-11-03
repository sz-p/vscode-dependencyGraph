import { parse, visit } from 'recast';
import {
	FunctionInformation,
	Param,
	FileInformation,
	DependencyTreeData
} from '../../data-dependencyTree/dependencyTreeData';
import { AnalyseData, AnalyseFiled } from './javascriptAnalysis.d';
import { getFunctionInformation } from './getFunctionInformation';
import { getImport, getRequire } from './getDependency';
import { getAST } from './getAST/getAST';
import { parseFile } from './parseFile';
import { getFileIconNameByFileName } from '../../utils/fileIcons/getFileIcon';

interface DependencyHash {
	[key: string]: DependencyTreeData;
}

const setDataToDependencyNode = function(
	dependencyNode: DependencyTreeData,
	baseName: string,
	fileInformation: FileInformation,
	extname: string,
	relativePath: string
): void {
	dependencyNode.name = baseName;
	dependencyNode.fileDescription = fileInformation;
	dependencyNode.type = getFileIconNameByFileName(baseName);
	dependencyNode.extension = extname;
	dependencyNode.relativePath = relativePath;
};

export const analysesFile = function(entryPath: string, folderPath: string): any {
	const options = {
		resolve: {
			extensions: [ '.js', '.jsx', '.ts', '.tsx', '.vue', '.scss', '.less' ]
		}
	};
	const dependencyHash = {} as DependencyHash;
	const dependencyTree = { absolutePath: entryPath,ancestors: [] as string[] } as DependencyTreeData;
	const dependencyList = [ dependencyTree ];

	while (dependencyList.length) {
		const dependencyNode = dependencyList.pop() as DependencyTreeData;
		const { absolutePath,ancestors } = dependencyNode;
		const parsedFile = parseFile(absolutePath, folderPath);
		if (!parsedFile) {
			continue;
		}
		const { codeString, extname, dirName, baseName, relativePath, description, introduction } = parsedFile;
		const fileInformation = { introduction, description } as FileInformation;
		const functionsList = [] as FunctionInformation[];
		setDataToDependencyNode(dependencyNode, baseName, fileInformation, extname, relativePath);

		let ast = getAST(extname, codeString);

		if (!ast) {
			dependencyNode.analysed = false;
			continue;
    }
    dependencyNode.lines = ast.loc?.end.line;
		dependencyNode.analysed = true;
    dependencyNode.children = [];
		visit(ast, {
			visitFunction(nodePath) {
				const functionInfo = getFunctionInformation(nodePath);
				functionsList.push(functionInfo);
				return false;
			},
			visitImportDeclaration(nodePath) {
				const importedFilePath = getImport(nodePath, dirName, options.resolve.extensions);
				if (!importedFilePath) return false;
				let dependencyChildren = undefined;
				if (dependencyHash[importedFilePath]) {
					dependencyChildren = dependencyHash[importedFilePath];
				} else {
          const dependencyChildrenAncestors = [].concat(ancestors as []) as string[];
          dependencyChildrenAncestors.push(baseName)
					dependencyChildren = { absolutePath: importedFilePath,ancestors:dependencyChildrenAncestors as string[] } as DependencyTreeData;
					dependencyList.push(dependencyChildren);
					dependencyHash[absolutePath] = dependencyNode as DependencyTreeData;
				}
        dependencyNode.children.push(dependencyChildren);
        return false;
			},
			visitIdentifier(nodePath) {
				const requireList = getRequire(nodePath, dirName);
				if (requireList) {
				}
				return false;
			}
		});
		dependencyNode.functions = functionsList;
	}
	return { dependencyTree, dependencyHash };
};
