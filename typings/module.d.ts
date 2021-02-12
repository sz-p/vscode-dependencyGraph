import * as vscode from "vscode";
import {
  DependencyTreeData,
  DependencyNodes,
  DependencyTree,
} from "../src/data-dependencyTree/dependencyTreeData";

declare module "*.html" {
  const content: string;
  export default content;
}

declare global {
  namespace NodeJS {
    interface Global {
      webViewPanel: vscode.WebviewPanel | undefined;
      dependencyTreeData:
        | {
            dependencyTreeData: DependencyTreeData;
            transportsData: {
              dependencyTree: DependencyTree;
              dependencyNodes: DependencyNodes;
            };
          }
        | undefined;
    }
  }
}
