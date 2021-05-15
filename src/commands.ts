import * as vscode from "vscode";
import { getDependencyTreeData } from "./data-dependencyTree/data-dependencyTree";
import { StatusCallBack } from "./data-dependencyTree/getDataStatusCallBack";
import { createView } from "./web-dependencyTree/openWebView";
import { postMessageCatchError } from "./utils/message/postMessageToWebView";
import { reOpenWebView } from "./web-dependencyTree/openWebView";
import { renderTreeView } from "./view-dependencyTree/renderTreeView";
import {
  MESSAGE_DEPENDENCY_TREE_DATA,
  MESSAGE_FOCUS_ON_NODE,
  MESSAGE_UPDATE_WEBVIEW,
  MsgKey,
} from "./utils/message/messagesKeys";
import { msgGetSavedData } from "./utils/message/messages";
import * as stringRandom from "string-random";
import { setData, isSavedData } from "./utils/fileSystem/data";
import { getCurrentFolderPath, thenAbleWithTimeout } from "./utils/utils";
import { showMessage } from "./utils/showMessage";
import { START_UPDATE_DATA, UPDATED_DATA, UPDATE_DATA_FAILED } from "./i18n/types";
import { i18n } from "./i18n/i18n";
export const command_createView = vscode.commands.registerCommand(
  "dependencygraph.createView",
  () => {
    createView();
  }
);

// export const command_postMessage = vscode.commands.registerCommand('dependencygraph.postMessage', () => {
//   postMessageCatchError({ key: 'postMessageTest' as MsgKey, value: 0 });
// });

const refreshFile = async (): Promise<boolean> => {
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
  let data = undefined;
  try {
    data = await getDependencyTreeData(refresh, scb);
  }
  catch (e) {
    return false
  }
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
    return true;
  } else {
    return false;
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
  "dependencygraph.focusOnNode",
  (fileName, fileData) => {
    postMessageCatchError({
      key: MESSAGE_FOCUS_ON_NODE,
      value: { fileName, fileData },
    });
  }
);
export const command_reOpenView = vscode.commands.registerCommand(
  "dependencygraph.reOpenView",
  (fileName, fileData) => {
    if (global.dependencyTreeData) {
      reOpenWebView(global.dependencyTreeData.dependencyTreeData);
    }
  }
);
export const command_refreshFile = vscode.commands.registerCommand(
  "dependencygraph.refreshFile",
  refreshFile
);
// TODO function overload
export const command_openFile = vscode.commands.registerCommand(
  "dependencygraph.openFileInView",
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
  "dependencygraph.saveData",
  saveData
);
export const command_upDateData = vscode.commands.registerCommand(
  "dependencygraph.upDateData",
  () => {
    refreshFile();
    saveData();
  }
);

export const command_saveDataWithMessage = vscode.commands.registerCommand(
  "dependencygraph.refreshFileWithMessage",
  async () => {
    await thenAbleWithTimeout(showMessage(i18n.getText(START_UPDATE_DATA)), 0);
    try {
      if (await refreshFile()) {
        showMessage(i18n.getText(UPDATED_DATA));
        if (isSavedData()) {
          saveData();
        }
      } else {
        showMessage(i18n.getText(UPDATE_DATA_FAILED), "error");
      }
    }
    catch (e) {
      showMessage(i18n.getText(UPDATE_DATA_FAILED), "error");
    }
  }
);

export const allCommands = [
  command_createView,
  command_reOpenView,
  command_saveData,
  command_upDateData,
  command_saveDataWithMessage,
  // command_postMessage
];
