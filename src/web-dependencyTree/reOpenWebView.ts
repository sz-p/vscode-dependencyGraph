import * as vscode from 'vscode';
import { createView } from './openWebView';
import { getBaseWebViewUri } from '../utils/getWebViewUri';
import { postMessage } from '../utils/postMessageToWebView';
import { MESSAGE_ASSETS_BASE_URL, MESSAGE_DEPENDENCY_TREE_DATA } from '../utils/messagesKeys';
import { DependencyTreeData } from '../data-dependencyTree/dependencyTreeMethods';
import { createWebviewPanel } from '../initExtension';

export const reOpenWebView = function(dependencyTreeData: DependencyTreeData) {
	const columnToShowIn = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
	if (global.webViewPanel) {
		// 如果我们已经有了一个面板，那就把它显示到目标列布局中
		global.webViewPanel.reveal(columnToShowIn);
	} else {
		createWebviewPanel();
		createView();
		postMessage({
			key: MESSAGE_ASSETS_BASE_URL,
			value: getBaseWebViewUri(),
			description: ''
		});
		// TODO post state
		postMessage({
			key: MESSAGE_DEPENDENCY_TREE_DATA,
			value: dependencyTreeData,
			description: ''
		});
	}
};
