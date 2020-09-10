import * as vscode from 'vscode';
import { initExtension } from './initExtension';
import { getDependencyTreeData, statusCallBackCatchError } from './data-dependencyTree/data-dependencyTree';
import { createView } from './web-dependencyTree/openWebView';
import { allCommands } from './commands';
import { renderTreeView } from './view-dependencyTree/renderTreeView';
import { openWebView } from './web-dependencyTree/openWebView';

export function activate(context: vscode.ExtensionContext) {
	// webView need catch getDependencyTreeData status create web view first

	// just create webView panel
	initExtension();
	// create webView content
	createView();

	// get dependency tree data
	const dependencyTreeData = getDependencyTreeData(statusCallBackCatchError);
	if (!dependencyTreeData) {
		return false;
	}
	global.dependencyTreeData = dependencyTreeData;

	// openWebView
	openWebView(dependencyTreeData);

	// render tree view
	renderTreeView(dependencyTreeData);

	// init commands
	allCommands.forEach((command) => {
		context.subscriptions.push(command);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivate-extension');
}
