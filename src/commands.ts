import * as vscode from "vscode";
import { getDependencyTreeData } from "./data-dependencyTree/data-dependencyTree";
import { StatusCallBack } from "./data-dependencyTree/statusCallBack";
import { createView } from "./web-dependencyTree/openWebView";
import { postMessageCatchError } from "./utils/message/postMessageToWebView";
import { reOpenWebView } from "./web-dependencyTree/openWebView";
import { renderTreeView } from "./view-dependencyTree/renderTreeView";
import {
  MESSAGE_DEPENDENCY_TREE_DATA,
  MESSAGE_FOCUS_ON_NODE,
  MESSAGE_UPDATE_WEBVIEW,
} from "./utils/message/messagesKeys";
import { msgGetSavedData } from "./utils/message/messages";
import * as stringRandom from "string-random";
import { setData } from "./utils/fileSystem/data";
import { getCurrentFolderPath, thenAbleWithTimeout } from "./utils/utils";
import { showMessage } from "./utils/showMessage";
import { START_UPDATE_DATA, UPDATED_DATA } from "./i18n/types";
import { i18n } from "./i18n/i18n";
export const command_createView = vscode.commands.registerCommand(
  "framegraph.createView",
  () => {
    createView();
  }
);

// export const command_postMessage = vscode.commands.registerCommand('framegraph.postMessage', () => {
// 	postMessageCatchError({ key: 'postMessageTest', value: message++ });
// });

const refreshFile = async () => {
  // no catch error may be webview is closed
  let postMessage = false;
  let refresh = true;
  if (global.webViewPanel) {
    postMessage = true;
    postMessageCatchError({
      key: MESSAGE_UPDATE_WEBVIEW,
      value: stringRandom(),
    });
  }
  const scb = new StatusCallBack(postMessage);
  const data = await getDependencyTreeData(refresh, scb);
  if (data) {
    global.dependencyTreeData = data;
    renderTreeView(global.dependencyTreeData.dependencyTreeData);
    if (global.webViewPanel) {
      postMessageCatchError({
        key: MESSAGE_DEPENDENCY_TREE_DATA,
        value: {
          data: data.transportsData,
          folderPath: getCurrentFolderPath(),
        },
      });
    }
  }
};

const saveData = () => {
  if (global?.dependencyTreeData?.transportsData) {
    setData(global.dependencyTreeData.transportsData);
    if (global.webViewPanel) {
      msgGetSavedData.post();
    }
  } else {
    //TODO no data error
  }
};

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
    if (global.dependencyTreeData) {
      reOpenWebView(global.dependencyTreeData.dependencyTreeData);
    }
  }
);
export const command_refreshFile = vscode.commands.registerCommand(
  "framegraph.refreshFile",
  refreshFile
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

export const command_saveData = vscode.commands.registerCommand(
  "framegraph.saveData",
  saveData
);
export const command_upDateData = vscode.commands.registerCommand(
  "framegraph.upDateData",
  () => {
    refreshFile();
    saveData();
  }
);
export const command_saveDataWithMessage = vscode.commands.registerCommand(
  "framegraph.refreshFileWithMessage",
  async () => {
    await thenAbleWithTimeout(showMessage(i18n.getText(START_UPDATE_DATA)), 0);
    refreshFile();
    showMessage(i18n.getText(UPDATED_DATA));
  }
);

export const allCommands = [
  command_createView,
  command_reOpenView,
  command_saveData,
  command_upDateData,
  command_saveDataWithMessage,
];
