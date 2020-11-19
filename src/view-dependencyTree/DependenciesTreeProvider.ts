import * as vscode from "vscode";
import { DependencyTreeData } from "../data-dependencyTree/dependencyTreeData";
import { renderTreeItem } from "./renderTreeItem";

export class DependenciesTreeProvider
  implements vscode.TreeDataProvider<DependencyTreeData> {
  constructor(private dependencyTreeData: DependencyTreeData) {}

  getTreeItem(node: DependencyTreeData): vscode.TreeItem {
    return renderTreeItem(node);
  }

  getChildren(node?: DependencyTreeData): DependencyTreeData[] {
    if (node) {
      return node.children;
    } else {
      return [this.dependencyTreeData];
    }
  }
}
