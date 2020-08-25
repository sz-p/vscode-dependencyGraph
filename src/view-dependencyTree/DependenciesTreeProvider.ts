import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DependencyTreeData } from '../data-dependencyTree/dependencyTreeMethods';
import { renderTreeItem } from './renderTreeItem';

export class DependenciesTreeProvider implements vscode.TreeDataProvider<DependencyTreeData> {
	constructor(private dependencyTreeData: DependencyTreeData) {}

	getTreeItem(node: DependencyTreeData): vscode.TreeItem {
		return renderTreeItem(node);
	}

	getChildren(node?: DependencyTreeData): DependencyTreeData[] {
		if (node) {
			return node.children;
		} else {
			return [ this.dependencyTreeData ];
		}
	}

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}
		return true;
	}
}
