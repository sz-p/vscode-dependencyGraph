import * as vscode from 'vscode';
import * as fs from 'fs';
import * as dependencyTree from 'dependency-tree';

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
		console.log(folderPath + packageJson.main);
		return folderPath + packageJson.main;
	} else {
		return undefined;
	}
};
const getDependencyTree = function(filename: string, directory: string) {
	const dt = dependencyTree({
		filename: filename,
		directory: directory
	});
};
const readfile = vscode.commands.registerCommand('extension.readfile', () => {
	const folderPath = getCurrentFolderPath();
	if (folderPath) {
		const packageJsonPath = getPackageJsonPath(folderPath);
		if (packageJsonPath) {
			const mainFilePath = getMainFilePath(packageJsonPath, folderPath);
			if (mainFilePath) {
				getDependencyTree(mainFilePath, folderPath);
			}
		} else {
			console.log('no package');
		}
	}
});
export { readfile };
