import * as vscode from "vscode";
import { DependencyTreeData } from "../data-dependencyTree/dependencyTreeData";
import { renderTreeItem } from "./renderTreeItem";

export type DependencyTreeDataInTreeView = {
  children: DependencyTreeData[],
  name: string,
  absolutePath: string,
  relativePath: string,
  type: string,
  ancestors: string[]
}

export class DependenciesTreeProvider
  implements vscode.TreeDataProvider<DependencyTreeDataInTreeView> {
  constructor(private dependencyTreeData: DependencyTreeData) { }

  getTreeItem(node: DependencyTreeDataInTreeView): vscode.TreeItem {
    return renderTreeItem(node);
  }

  getChildren(node?: DependencyTreeDataInTreeView): DependencyTreeDataInTreeView[] {
    if (node) {
      return node.children.map((child) => {
        const { name, relativePath, type, fileID, children, absolutePath } = child
        return {
          children,
          absolutePath,
          name,
          relativePath,
          type,
          fileID,
          ancestors: [...node.ancestors, relativePath],
        };
      });
    } else {
      const { name, relativePath, type, children, absolutePath } = this.dependencyTreeData
      return [{
        children,
        absolutePath,
        name,
        relativePath,
        type,
        ancestors: [relativePath],
      }];
    }
  }
}
