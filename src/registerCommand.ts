import { postMessage } from './utils/postMessageToWebView';
import * as vscode from 'vscode';
import { getDependencyTreeData } from './data-dependencyTree/data-dependencyTree';
import { DependenciesTreeProvider } from './view-dependencyTree/DependenciesTreeProvider';
import { createView } from './web-dependencyTree/openWebView';
import { webViewPanel } from './initExtension';

export const registerCommand = function(context: vscode.ExtensionContext): void {
	let message = 0;
	context.subscriptions.push(
		vscode.commands.registerCommand('framegraph.readfile', () => {
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
	context.subscriptions.push(
		vscode.commands.registerCommand('framegraph.openView', () => {
			createView(webViewPanel);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('framegraph.postMessage', () => {
			postMessage({ key: 'postMessageTest', value: message++ });
		})
	);
};
