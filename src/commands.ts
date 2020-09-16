import * as vscode from 'vscode';
import { getDependencyTreeData, statusCallBackCatchError } from './data-dependencyTree/data-dependencyTree';
import { createView } from './web-dependencyTree/openWebView';
import { postMessageCatchError } from './utils/message/postMessageToWebView';
import { reOpenWebView } from './web-dependencyTree/openWebView';
import { renderTreeView } from './view-dependencyTree/renderTreeView';
import { onError } from './utils/error/onError';
import { NO_DEPENDENCY_TREE_DATA } from './utils/error/errorKey';
import {
	MESSAGE_DEPENDENCY_TREE_DATA,
	MESSAGE_FOCUS_ON_NODE,
	MESSAGE_UPDATE_WEBVIEW
} from './utils/message/messagesKeys';
import stringRandom from 'string-random';

let message = 0;

export const command_createView = vscode.commands.registerCommand('framegraph.createView', () => {
	createView();
});

// export const command_postMessage = vscode.commands.registerCommand('framegraph.postMessage', () => {
// 	postMessageCatchError({ key: 'postMessageTest', value: message++ });
// });

export const command_focusOnNode = vscode.commands.registerCommand('framegraph.focusOnNode', (fileName, fileData) => {
	postMessageCatchError({ key: MESSAGE_FOCUS_ON_NODE, value: { fileName, fileData } });
});
export const command_reOpenView = vscode.commands.registerCommand('framegraph.reOpenView', (fileName, fileData) => {
	if (global.dependencyTreeData) {
		reOpenWebView(global.dependencyTreeData);
	} else {
		onError(NO_DEPENDENCY_TREE_DATA);
	}
});
export const command_refreshFile = vscode.commands.registerCommand('framegraph.refreshFile', (fileName, fileData) => {
	// no catch error may be webview is closed
	let callback = undefined;
	if (global.webViewPanel) {
		callback = statusCallBackCatchError;
	}
	postMessageCatchError({ key: MESSAGE_UPDATE_WEBVIEW, value: stringRandom() });
	global.dependencyTreeData = getDependencyTreeData(callback);
	renderTreeView(global.dependencyTreeData);
	if (global.webViewPanel) {
		postMessageCatchError({ key: MESSAGE_DEPENDENCY_TREE_DATA, value: global.dependencyTreeData });
	}
});
export const allCommands = [ command_createView, command_reOpenView ];
