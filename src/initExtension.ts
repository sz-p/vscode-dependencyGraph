import * as vscode from 'vscode';
import { processMessage } from './processMessage';
import { i18n } from './i18n/i18n';
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
	i18n.setLanguage(vscode.env.language);
	createWebviewPanel();
};
