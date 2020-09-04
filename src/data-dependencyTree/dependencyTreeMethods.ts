import * as vscode from 'vscode';
import * as fs from 'fs';
import * as dependencyTree from 'dependency-tree';
import { getFileIconNameByFileName } from '../utils/getFileIcon';

export interface DependencyTreeData {
	name: string;
	type: string;
	extension: string;
	absolutePath: string;
	relativePath: string;
	ancestors: string[];
	children: Array<DependencyTreeData>;
}

/**
 * get current workspace first folder path
 *
 * @returns {(String | undefined)}
 */
export const getCurrentFolderPath = function(): string | undefined {
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

export const getPackageJsonPath = function(folderPath: string): string | undefined {
	const files = fs.readdirSync(folderPath);
	if (files.includes('package.json')) {
		return folderPath + '/package.json';
	} else {
		return undefined;
	}
};

export const getMainFilePath = function(packageJsonPath: string, folderPath: string): string | undefined {
	const packageJson = require(packageJsonPath);
	if (packageJson.main) {
		return folderPath + packageJson.main;
	} else {
		return undefined;
	}
};
export const getDependencyTree = function(filename: string, directory: string): dependencyTree.DependencyObj {
	const dt = dependencyTree({
		filter: (path: string) => path.indexOf('node_modules') === -1,
		filename: filename,
		directory: directory
	});
	return dt;
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
