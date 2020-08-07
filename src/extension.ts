import * as vscode from 'vscode';
import * as paths from './paths';
import { helloWorld } from './helloworld';
import { getDependencyTreeData, DependencyTreeData } from './data-dependencyTree/data-dependencyTree';
import { createView } from './openWebView';
import { DependenciesTreeProvider } from './view-dependencyTree/DependenciesTreeProvider';
export function activate(context: vscode.ExtensionContext) {
	console.log('init-extension');
	createView();


	context.subscriptions.push(helloWorld);
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.readfile', () => {
			const dependencyTreeData = getDependencyTreeData();
			if (!dependencyTreeData) {
				vscode.window.showInformationMessage('No dependency');
				return false;
			}
			vscode.window.registerTreeDataProvider(
				'framegraphExplorer-DependencyTree',
				new DependenciesTreeProvider(dependencyTreeData)
			);
		})
	);
	// context.subscriptions.push(vscode.commands.registerCommand('extension.readfile', getDependencyTreeData));
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivate-extension');
}
