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

const getTreeNodeFromDependencyTreeData = function (data: DependencyTreeData): DependencyTreeDataInTreeView {
  const { relativePath, type, children, absolutePath } = data
  let { name } = data
  const filePath = relativePath.replace(/\\/g, "/").split("/");
  filePath.pop();
  const fileFatherDirName = filePath.pop();
  if (name.includes("index") && fileFatherDirName) {
    name = fileFatherDirName + '/' + name
  }
  return {
    children,
    absolutePath,
    name,
    relativePath,
    type,
    ancestors: [relativePath],
  }
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
        return getTreeNodeFromDependencyTreeData(child);
      });
    } else {
      return [getTreeNodeFromDependencyTreeData(this.dependencyTreeData)];
    }
  }
}
