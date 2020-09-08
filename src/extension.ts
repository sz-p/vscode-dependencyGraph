import * as vscode from 'vscode';
import { initExtension } from './initExtension';
import { getDependencyTreeData } from './data-dependencyTree/data-dependencyTree';
import { createView } from './web-dependencyTree/openWebView';
import { DependenciesTreeProvider } from './view-dependencyTree/DependenciesTreeProvider';
import { allCommands } from './commands';
export function activate(context: vscode.ExtensionContext) {
	initExtension();
	createView();
	const dependencyTreeData = getDependencyTreeData();
	if (!dependencyTreeData) {
		vscode.window.showInformationMessage('No dependency');
		return false;
	}
	vscode.window.registerTreeDataProvider(
		'framegraphExplorer-DependencyTree',
		new DependenciesTreeProvider(dependencyTreeData)
	);

	allCommands.forEach((command) => {
		context.subscriptions.push(command);
	});
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivate-extension');
}
