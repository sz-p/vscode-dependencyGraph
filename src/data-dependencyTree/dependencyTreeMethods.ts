import * as fs from 'fs';
import * as dependencyTree from 'dependency-tree';
// import * as getdependencytree from 'get-dependency-tree';
import * as path from 'path';
import * as vscode from 'vscode';

import { getFileIconNameByFileName } from '../utils/fileIcons/getFileIcon';
import { DependencyTreeData } from './dependencyTreeData';
import { setEntryFilePath, getCurrentFolderPath as getFolderPathByConfig, setCurrentFolderPath } from '../utils/config';

import { analysesFile } from '../fileAnalysis/javascript/javascriptAnalysis';

export const getPackageJsonPath = function(folderPath: string): string | undefined {
	const files = fs.readdirSync(folderPath);
	if (files.includes('package.json')) {
		return folderPath + '/package.json';
	} else {
		return undefined;
	}
};

export const getMainFilePath = function(folderPath: string, packageJsonPath: string): string | undefined {
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	// const packageJson = require(packageJsonPath);
	if (packageJson.main) {
		const mainFilePath = path.join(folderPath, packageJson.main);
		setEntryFilePath(mainFilePath);
		return mainFilePath;
	} else {
		return undefined;
	}
};
export const getDependencyTree = function(
	filename: string,
	directory: string
): dependencyTree.DependencyObj | undefined {
	let tree = undefined;
	try {
		// tree = getdependencytree({ entry: filename }).tree;
		// tree = dependencyTree({
		// 	filter: (path: string) => path.indexOf('node_modules') === -1,
		// 	filename: filename,
		// 	directory: directory
		// });
	} catch (err) {
		return undefined;
	}

	return tree;
};

/**
 * get current workspace first folder path
 * catch path return path
 *
 * @returns {(String | undefined)}
 */
export const getCurrentFolderPath = function(): string | undefined {
	let currentFolderPath = getFolderPathByConfig();
	if (currentFolderPath) {
		return currentFolderPath;
	}
	const ws = vscode.workspace;
	let folder = ws.workspaceFolders;
	let folderPath = '';
	if (folder !== undefined) {
		folderPath = folder[0].uri.fsPath;
	}
	if (folderPath) {
		setCurrentFolderPath(folderPath);
		return folderPath;
	} else {
		return undefined;
	}
};
export const processTreeData = function(
	dependencyTree: dependencyTree.DependencyObj,
	folderPath: string
): DependencyTreeData {
	let dependencyTreeData: DependencyTreeData = {} as DependencyTreeData;
	const nodes = [
		{
			dependencyTree,
			dependencyTreeData,
			ancestors: [] as string[],
			path: Object.keys(dependencyTree)[0]
		}
	];
	while (nodes.length) {
		const node = nodes.pop();
		if (node) {
			const file = node.path.split('\\').pop() as string;
			const fileName = file;
			const extension = file.split('.').pop();
			const type = getFileIconNameByFileName(fileName);
			const analyseData = analysesFile(node.path, folderPath);
			if (analyseData.analysed) {
				node.dependencyTreeData.analysed = true;
				node.dependencyTreeData.lines = analyseData.lines;
				node.dependencyTreeData.functions = analyseData.functionsList;
			} else {
				node.dependencyTreeData.analysed = false;
			}
			node.dependencyTreeData.fileDescription = analyseData.fileInformation;
			node.dependencyTreeData.name = fileName;
			node.dependencyTreeData.absolutePath = node.path;
			node.dependencyTreeData.ancestors = node.ancestors;
			node.dependencyTreeData.relativePath = node.path.replace(folderPath, '');
			node.dependencyTreeData.extension = extension as string;
			node.dependencyTreeData.type = type;
			node.dependencyTreeData.children = [] as Array<DependencyTreeData>;
			for (let keys in node.dependencyTree[node.path]) {
				let ancestors = [] as string[];
				ancestors = ancestors.concat(...node.ancestors);
				ancestors.push(node.path);
				let subNode = {} as DependencyTreeData;
				node.dependencyTreeData.children.push(subNode);
				nodes.push({
					dependencyTree: node.dependencyTree[node.path],
					path: keys,
					ancestors: ancestors,
					dependencyTreeData: subNode
				});
			}
		}
	}
	return dependencyTreeData;
};
