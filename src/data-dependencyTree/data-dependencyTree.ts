import * as vscode from 'vscode';
import * as fs from 'fs';
import * as dependencyTree from 'dependency-tree';

interface dependencyTreeData {
	name: string;
	path: string;
	type: string;
	children: Array<dependencyTreeData>;
}
/**
 * get current workspace first folder path
 *
 * @returns {(String | undefined)}
 */
const getCurrentFolderPath = function(): string | undefined {
	const ws = vscode.workspace;
	let folder = ws.workspaceFolders;
	let folderPath = '';
	if (folder !== undefined) {
		folderPath = folder[0].uri.fsPath;
	}
	if (folderPath) {
		return folderPath;
	} else {
		return undefined;
	}
};
const getPackageJsonPath = function(folderPath: string): string | undefined {
	const files = fs.readdirSync(folderPath);
	if (files.includes('package.json')) {
		return folderPath + '/package.json';
	} else {
		return undefined;
	}
};
const getMainFilePath = function(packageJsonPath: string, folderPath: string): string | undefined {
	const packageJson = require(packageJsonPath);
	if (packageJson.main) {
		return folderPath + packageJson.main;
	} else {
		return undefined;
	}
};
const getDependencyTree = function(filename: string, directory: string): dependencyTree.DependencyObj {
	const dt = dependencyTree({
		filename: filename,
		directory: directory
	});
	console.log(dt);
	return dt;
};
const processTreeData = function(dependencyTree: dependencyTree.DependencyObj, basePath: string): dependencyTreeData {
	let dependencyTreeData: dependencyTreeData = {} as dependencyTreeData;
	const nodes = [ { d: dependencyTree, a: dependencyTreeData } ];
	while (nodes.length) {
		const node = nodes.pop();
		if (node) {
			const paths = Object.keys(node.d);
			for (let i = 0; i < paths.length; i++) {
				const path = paths[i];
				const file = path.split('\\').pop() as string;
				const fileName = file.split('.')[0];
				const fileType = file.split('.')[1];
				node.a.name = fileName;
				node.a.path = path;
				node.a.type = fileType;
				node.a.children = [] as Array<dependencyTreeData>;
				for (let j = 0; j < Object.keys(node.d[path]).length; j++) {
					let subNode = {} as dependencyTreeData;
					node.a.children.push(subNode);
					nodes.push({
						d: node.d[path],
						a: subNode
					});
				}
			}
		}
	}
	console.log(dependencyTreeData);
	return dependencyTreeData;
};
const getDependencyTreeData = () => {
	const folderPath = getCurrentFolderPath();
	if (folderPath) {
		const packageJsonPath = getPackageJsonPath(folderPath);
		if (packageJsonPath) {
			const mainFilePath = getMainFilePath(packageJsonPath, folderPath);
			if (mainFilePath) {
				return processTreeData(getDependencyTree(mainFilePath, folderPath), folderPath);
			} else {
				console.log('no mainFile');
				return undefined;
			}
		} else {
			console.log('no package');
			return undefined;
		}
	} else {
		console.log('no folderPath');
		return undefined;
	}
};
export { getDependencyTreeData };
