import * as vscode from 'vscode';
import * as paths from './paths';
import { webViewPanel } from './initExtension';
import { getDependencyTreeData } from './data-dependencyTree/data-dependencyTree';
import { createView } from './web-dependencyTree/openWebView';
import { DependenciesTreeProvider } from './view-dependencyTree/DependenciesTreeProvider';
import { registerCommand} from './registerCommand';

export function activate(context: vscode.ExtensionContext) {
	createView(webViewPanel);

	const dependencyTreeData = getDependencyTreeData();
	if (!dependencyTreeData) {
		vscode.window.showInformationMessage('No dependency');
		return false;
	}
	vscode.window.registerTreeDataProvider(
		'framegraphExplorer-DependencyTree',
		new DependenciesTreeProvider(dependencyTreeData)
  );
  registerCommand(context);
}

// this method is called when your extension is deactivated
export function deactivate() {
	console.log('deactivate-extension');
}
