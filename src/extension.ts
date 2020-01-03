import * as vscode from 'vscode';
import * as paths from './paths';
import { helloWorld } from './helloworld';
import { createView } from './openWebView';
export function activate(context: vscode.ExtensionContext) {
	console.log('init-extension');
	createView();
	context.subscriptions.push(helloWorld);
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivate-extension');
}
