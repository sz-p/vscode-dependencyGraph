import * as vscode from 'vscode';

const getConfig = function(section: string) {
	return vscode.workspace.getConfiguration(section);
};
const getFrameGraphConfig = function(section: string) {
	return getConfig('framegraph').inspect(section);
};
const setFrameGraphConfig = function(section: string, value: any, global: undefined = undefined) {
	return getConfig('framegraph').update(section, value, global);
};
export const getEntryFilePath = function(): string | undefined {
	return getFrameGraphConfig('entryFilePath')?.workspaceValue as string;
};
export const setEntryFilePath = function(value: any) {
	return setFrameGraphConfig('entryFilePath', value);
};
export const getCurrentFolderPath = function() :string | undefined  {
	return getFrameGraphConfig('folderPath')?.workspaceValue as string;
}
export const setCurrentFolderPath = function(value:any){
	return setFrameGraphConfig('folderPath', value);
}
