import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import { setEntryFileRelativePath } from '../utils/config';

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
		const mainFilePath = path.join(packageJson.main);
		setEntryFileRelativePath(mainFilePath);
		return mainFilePath;
	} else {
		return undefined;
	}
};

/**
 * get current workspace first folder path
 * catch path return path
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
		// setCurrentFolderPath(folderPath);
		return folderPath;
	} else {
		return undefined;
	}
};
