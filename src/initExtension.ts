import * as vscode from 'vscode';

const createWebviewPanel = function(): vscode.WebviewPanel {
	const webViewPanel = vscode.window.createWebviewPanel('framegraph-view', 'Frame Graph', vscode.ViewColumn.One, {
		enableScripts: true,
		retainContextWhenHidden: true
	});
	return webViewPanel;
};

export const webViewPanel = createWebviewPanel();
