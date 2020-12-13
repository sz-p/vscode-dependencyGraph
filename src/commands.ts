import * as vscode from "vscode";
import { getDependencyTreeData } from "./data-dependencyTree/data-dependencyTree";
import { createView } from "./web-dependencyTree/openWebView";
import { postMessageCatchError } from "./utils/message/postMessageToWebView";
import { reOpenWebView } from "./web-dependencyTree/openWebView";
import { renderTreeView } from "./view-dependencyTree/renderTreeView";
import {
  MESSAGE_DEPENDENCY_TREE_DATA,
  MESSAGE_FOCUS_ON_NODE,
  MESSAGE_UPDATE_WEBVIEW,
} from "./utils/message/messagesKeys";
import * as stringRandom from "string-random";

let message = 0;

export const command_createView = vscode.commands.registerCommand(
  "framegraph.createView",
  () => {
    createView();
  }
);

// export const command_postMessage = vscode.commands.registerCommand('framegraph.postMessage', () => {
// 	postMessageCatchError({ key: 'postMessageTest', value: message++ });
// });

export const command_focusOnNode = vscode.commands.registerCommand(
  "framegraph.focusOnNode",
  (fileName, fileData) => {
    postMessageCatchError({
      key: MESSAGE_FOCUS_ON_NODE,
      value: { fileName, fileData },
    });
  }
);
export const command_reOpenView = vscode.commands.registerCommand(
  "framegraph.reOpenView",
  (fileName, fileData) => {
    reOpenWebView(global.dependencyTreeData);
  }
);
export const command_refreshFile = vscode.commands.registerCommand(
  "framegraph.refreshFile",
  (fileName, fileData) => {
    // no catch error may be webview is closed
    let postMessage = false;
    if (global.webViewPanel) {
      postMessage = true;
      postMessageCatchError({
        key: MESSAGE_UPDATE_WEBVIEW,
        value: stringRandom(),
      });
    }
    global.dependencyTreeData = getDependencyTreeData(postMessage);
    renderTreeView(global.dependencyTreeData);
    if (global.webViewPanel) {
      postMessageCatchError({
        key: MESSAGE_DEPENDENCY_TREE_DATA,
        value: global.dependencyTreeData,
      });
    }
  }
);
// TODO function overload
export const command_openFile = vscode.commands.registerCommand(
  "framegraph.openFileInView",
  (absoluteFilePath) => {
    let _absolutePath = undefined;
    if (typeof absoluteFilePath === "string") {
      _absolutePath = absoluteFilePath;
    } else {
      _absolutePath = absoluteFilePath.absolutePath;
    }
    let uri = vscode.Uri.file(_absolutePath);
    vscode.workspace.openTextDocument(uri).then((doc) => {
      vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
    });
  }
);
export const allCommands = [command_createView, command_reOpenView];
