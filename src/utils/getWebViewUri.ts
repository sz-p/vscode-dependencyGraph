import * as vscode from "vscode";
import * as path from "path";
import { assetsPath } from "../paths";

export const getBaseWebViewUri = function (): string | undefined {
  if (global.webViewPanel) {
    return global.webViewPanel.webview
      .asWebviewUri(vscode.Uri.file(path.join(assetsPath)))
      .toString();
  }
};
