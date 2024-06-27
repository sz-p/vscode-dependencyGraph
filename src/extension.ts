/**
 * @introduction main file
 *
 * @description application will start from this file
 */
import * as vscode from "vscode";
import { initExtension } from "./initExtension";
import { getDependencyTreeData } from "./data-dependencyTree/data-dependencyTree";
import { StatusCallBack } from "./data-dependencyTree/getDataStatusCallBack";
import { createView, openWebView } from "./web-dependencyTree/openWebView";
import { allCommands } from "./commands";
import { renderTreeView } from "./view-dependencyTree/renderTreeView";
import { logger } from "./utils/logger";

// this method is called when your extension is started
export async function activate(context: vscode.ExtensionContext) {
  // init commands
  logger.info("init commands")
  allCommands.forEach((command) => {
    context.subscriptions.push(command);
  });
  // webView need catch getDependencyTreeData status create web view first
  // just create webView panel
  logger.info("init extension")
  initExtension();
  // create webView content
  logger.info("create web view")
  createView();
  const scb = new StatusCallBack(true);
  // get dependency tree data
  logger.info("start get dependency tree data")
  const dependencyTreeData = await getDependencyTreeData(false, scb);

  global.dependencyTreeData = dependencyTreeData;

  // openWebView
  logger.info("open web view with dependency tree data")
  openWebView(dependencyTreeData?.dependencyTreeData);

  // render tree view
  logger.info("render tree view in treeDataProvider")
  renderTreeView(dependencyTreeData?.dependencyTreeData);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log("deactivate-extension");
}
