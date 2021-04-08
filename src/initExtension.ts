/**
 * @introduction init extension
 *
 * @description create webview panel\n set language
 */
import * as vscode from "vscode";
import { processMessage } from "./processMessage";
import { i18n } from "./i18n/i18n";
import { FRAME_GRAPH_WEBVIEW } from "./i18n/types";

/**
 * just create webView panel
 * create webView content is in another function
 */
export const createWebviewPanel = function (): void {
  global.webViewPanel = vscode.window.createWebviewPanel(
    "dependencygraph-view",
    i18n.getText(FRAME_GRAPH_WEBVIEW),
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );
  global.webViewPanel.webview.onDidReceiveMessage((e) => {
    processMessage(e);
  });
};

/**
 * init language
 * init webview panel
 */
export const initExtension = function () {
  i18n.setLanguage(vscode.env.language);
  createWebviewPanel();
};
