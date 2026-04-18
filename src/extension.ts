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
import { msgPostDependencyTreeDataToWebView } from "./utils/message/messages"
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
  await createView();
  // create webView content
  const scb = new StatusCallBack(true);
  logger.info("open web view")
  openWebView();
  // get dependency tree data
  logger.info("start get dependency tree data")
  const dependencyTreeData = await getDependencyTreeData(false, scb);

  global.dependencyTreeData = dependencyTreeData;

  // render tree view
  logger.info("render tree view in treeDataProvider")
  renderTreeView(dependencyTreeData?.dependencyTreeData);

  // openWebView
  logger.info("open web view with dependency tree data")
  msgPostDependencyTreeDataToWebView();

  // Auto-refresh graph when workspace files change
  if (vscode.workspace.workspaceFolders?.length) {
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "**/*")
    );

    let debounceTimer: NodeJS.Timeout | undefined;
    const debouncedRefresh = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        vscode.commands.executeCommand("dependencygraph.upDateData");
      }, 500);
    };

    const shouldIgnore = (uri: vscode.Uri) =>
      uri.fsPath.includes(".dependencygraph");

    watcher.onDidChange((uri) => { if (!shouldIgnore(uri)) debouncedRefresh(); });
    watcher.onDidCreate((uri) => { if (!shouldIgnore(uri)) debouncedRefresh(); });
    watcher.onDidDelete((uri) => { if (!shouldIgnore(uri)) debouncedRefresh(); });

    context.subscriptions.push(watcher);
  }

}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log("deactivate-extension");
}
