import * as vscode from 'vscode';
import * as paths from './paths';
import { helloWorld } from './helloworld';
import { getDependencyTreeData } from './data-dependencyTree/data-dependencyTree';
import { createView } from './openWebView';
import { DependenciesTreeProvider } from './view-dependencyTree/DependenciesTreeProvider';
export function activate(context: vscode.ExtensionContext) {
	console.log('init-extension');
	createView();
	context.subscriptions.push(helloWorld);
	context.subscriptions.push(vscode.commands.registerCommand('extension.readfile', getDependencyTreeData));
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivate-extension');
}
