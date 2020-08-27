import * as vscode from 'vscode';
import { getDependencyTreeData } from './data-dependencyTree/data-dependencyTree';
import { DependenciesTreeProvider } from './view-dependencyTree/DependenciesTreeProvider';
import { createView } from './web-dependencyTree/openWebView';
import { webViewPanel } from './initExtension';
import { postMessage } from './utils/postMessageToWebView';
import { MESSAGE_FOCUS_ON_NODE } from './utils/messagesKeys';
let message = 0;

export const command_readFile = vscode.commands.registerCommand('framegraph.readfile', () => {
	const dependencyTreeData = getDependencyTreeData();
	if (!dependencyTreeData) {
		vscode.window.showInformationMessage('No dependency');
		return false;
	}
	vscode.window.registerTreeDataProvider(
		'framegraphExplorer-DependencyTree',
		new DependenciesTreeProvider(dependencyTreeData)
	);
});

export const command_openView = vscode.commands.registerCommand('framegraph.openView', () => {
	createView(webViewPanel);
});

export const command_postMessage = vscode.commands.registerCommand('framegraph.postMessage', () => {
	postMessage({ key: 'postMessageTest', value: message++ });
});

export const command_focusOnNode = vscode.commands.registerCommand('framegraph.focusOnNode', (fileName, fileData) => {
	postMessage({ key: MESSAGE_FOCUS_ON_NODE, value: { fileName, fileData } });
});
export const allCommands = [ command_readFile, command_openView, command_postMessage ];
