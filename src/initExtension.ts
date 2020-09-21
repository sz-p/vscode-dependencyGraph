import * as vscode from 'vscode';
import { processMessage } from './processMessage';
export const createWebviewPanel = function(): void {
	global.webViewPanel = vscode.window.createWebviewPanel('framegraph-view', 'Frame Graph', vscode.ViewColumn.One, {
		enableScripts: true,
		retainContextWhenHidden: true
	});
	global.webViewPanel.webview.onDidReceiveMessage((e) => {
		processMessage(e);
	});
};

export const initExtension = function() {
	createWebviewPanel();
};
