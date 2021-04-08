import { DependencyTreeData } from "../data-dependencyTree/dependencyTreeData";
import { getFileIconPathByFileType } from "../utils/fileIcons/getFileIcon";
import * as vscode from "vscode";

export function renderTreeItem(data: DependencyTreeData): vscode.TreeItem {
  const hasChildren = data.children.length ? true : false;
  const collapsibleState = hasChildren
    ? vscode.TreeItemCollapsibleState.Collapsed
    : vscode.TreeItemCollapsibleState.None;
  const treeItem = new vscode.TreeItem(data.name, collapsibleState);
  treeItem.tooltip = data.relativePath;
  treeItem.iconPath = getFileIconPathByFileType(data.type);
  treeItem.command = {
    command: "dependencygraph.focusOnNode",
    title: "focusOnNode",
    arguments: [data.name, data],
  };
  return treeItem;
}
