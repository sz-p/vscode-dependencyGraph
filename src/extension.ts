/**
 * @introduction main file
 *
 * @description application will start from this file
 */
import * as vscode from "vscode";
import { initExtension } from "./initExtension";
import { getDependencyTreeData } from "./data-dependencyTree/data-dependencyTree";
import { createView } from "./web-dependencyTree/openWebView";
import { allCommands } from "./commands";
import { renderTreeView } from "./view-dependencyTree/renderTreeView";
import { openWebView } from "./web-dependencyTree/openWebView";

// this method is called when your extension is started
export async function activate(context: vscode.ExtensionContext) {
  // init commands
  allCommands.forEach((command) => {
    context.subscriptions.push(command);
  });
  // webView need catch getDependencyTreeData status create web view first
  // just create webView panel
  initExtension();
  // create webView content
  createView();

  // get dependency tree data
  const dependencyTreeData = await getDependencyTreeData(true);

  global.dependencyTreeData = dependencyTreeData;

  // openWebView
  openWebView(dependencyTreeData?.dependencyTreeData);

  // render tree view
  renderTreeView(dependencyTreeData?.dependencyTreeData);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log("deactivate-extension");
}
