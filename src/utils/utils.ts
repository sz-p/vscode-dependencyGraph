import * as vscode from 'vscode';
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

const getConfig = function(section: string) {
	return vscode.workspace.getConfiguration();
};
const getFrameGraphConfig = function(section: string) {
	return getConfig('framegraph').inspect(section);
};
const setFrameGraphConfig = function(section: string, value: any, global: boolean = false) {
	return getConfig('framegraph').update(section, value, global);
};
export const getEntryFilePath = function() {
	return getFrameGraphConfig('entryFilePath');
};
export const setEntryFilePath = function(value: any) {
	return setFrameGraphConfig('entryFilePath', value);
};
