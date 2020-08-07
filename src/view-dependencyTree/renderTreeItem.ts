import { DependencyTreeData } from '../data-dependencyTree/data-dependencyTree';
import * as vscode from 'vscode';

export function renderTreeItem(data: DependencyTreeData): vscode.TreeItem {
	const hasChildren = data.children.length ? true : false;
	const collapsibleState = hasChildren
		? vscode.TreeItemCollapsibleState.Collapsed
		: vscode.TreeItemCollapsibleState.None;
	const treeItem = new vscode.TreeItem(data.name, collapsibleState);
	treeItem.tooltip = data.path;
	return treeItem;
}
