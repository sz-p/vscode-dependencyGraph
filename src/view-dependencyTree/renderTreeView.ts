import * as vscode from "vscode";
import { DependenciesTreeProvider } from "./DependenciesTreeProvider";
import { DependencyTreeData } from "../data-dependencyTree/dependencyTreeData";
export const renderTreeView = function (
  dependencyTreeData: DependencyTreeData | undefined
) {
  const DTD = dependencyTreeData
    ? dependencyTreeData
    : (({
        name: undefined,
        type: undefined,
        absolutePath: undefined,
        relativePath: undefined,
        extension: undefined,
        children: [],
        ancestors: [],
      } as unknown) as DependencyTreeData);
  vscode.window.registerTreeDataProvider(
    "framegraphExplorer-DependencyTree",
    new DependenciesTreeProvider(DTD)
  );
};
