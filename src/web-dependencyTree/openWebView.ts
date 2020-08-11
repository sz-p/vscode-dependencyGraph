/**
 * @description create a web view to show frame graph
 */
import * as vscode from 'vscode';
import * as paths from '../paths';
const htmlText = require('./index.html');

// import * as htmlText  from './index.html';
console.log(htmlText);
/**
 * @description create view
 */
const createView = function(): void {
	let panel = vscode.window.createWebviewPanel('framegraph-view', 'Frame Graph', vscode.ViewColumn.One, {
		enableScripts: true,
		retainContextWhenHidden: true
	});
	panel.iconPath = vscode.Uri.file(paths.framegraphPNG);
	// panel.webview.html = htmlText;
};

export { createView };
