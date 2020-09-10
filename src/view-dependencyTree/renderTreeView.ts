import * as vscode from 'vscode';
import { DependenciesTreeProvider } from './DependenciesTreeProvider';
import { DependencyTreeData } from '../data-dependencyTree/dependencyTreeData';
export const renderTreeView = function(dependencyTreeData: DependencyTreeData) {
	vscode.window.registerTreeDataProvider(
		'framegraphExplorer-DependencyTree',
		new DependenciesTreeProvider(dependencyTreeData)
	);
};
