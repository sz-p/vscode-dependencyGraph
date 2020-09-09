import * as vscode from 'vscode';
export const createWebviewPanel = function(): void {
	global.webViewPanel = vscode.window.createWebviewPanel('framegraph-view', 'Frame Graph', vscode.ViewColumn.One, {
		enableScripts: true,
		retainContextWhenHidden: true
	});
};

export const initExtension = function() {
	createWebviewPanel();
};
