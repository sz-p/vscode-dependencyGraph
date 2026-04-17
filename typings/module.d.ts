import * as vscode from "vscode";
import {
  DependencyTreeData,
  TransportsData,
} from "../src/data-dependencyTree/dependencyTreeData";

declare module "*.html" {
  const content: string;
  export default content;
}

declare global {
  namespace NodeJS {
    interface Global {
      webViewPanel: vscode.WebviewPanel | undefined;
      webViewReady: boolean | undefined;
      dependencyTreeData:
      | {
        dependencyTreeData: DependencyTreeData;
        transportsData: TransportsData;
      }
      | undefined;
    }
  }
}
