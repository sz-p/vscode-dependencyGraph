import * as vscode from "vscode";
import { getDependencyTreeData } from "./data-dependencyTree/data-dependencyTree";
import { StatusCallBack } from "./data-dependencyTree/getDataStatusCallBack";
import { createView, reOpenWebViewWithTreeData } from "./web-dependencyTree/openWebView";
import { messagePoster } from "./utils/message/messagePoster";
import { renderTreeView } from "./view-dependencyTree/renderTreeView";
import {
  MESSAGE_FOCUS_ON_NODE,
  MESSAGE_UPDATE_WEBVIEW,
} from "./utils/message/messagesKeys";
import { msgGetSavedData, msgPostDependencyTreeDataToWebView } from "./utils/message/messages";
import * as stringRandom from "string-random";
import { setData, isSavedData } from "./utils/fileSystem/data";
import { thenAbleWithTimeout } from "./utils/utils";
import { getCurrentFolderPath } from "./utils/getCurrentFolderPath"
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
  let postedMessage = false;
  let refresh = true;
  if (global.webViewPanel) {
    postedMessage = true;
    messagePoster.newMsg({
      key: MESSAGE_UPDATE_WEBVIEW,
      value: stringRandom(),
    });
  }
  const scb = new StatusCallBack(postedMessage);
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
      msgPostDependencyTreeDataToWebView()
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
      msgGetSavedData();
    }
  } else {
    //TODO no data error
  }
};

const focusOnFile = async function (filePath) {

    const openEditors = vscode.window.visibleTextEditors;
    const targetEditor = openEditors.find(editor => editor.document.uri.fsPath === filePath);

    if (targetEditor) {
        await vscode.window.showTextDocument(targetEditor.document, { viewColumn: targetEditor.viewColumn });
    } else {
        const uri = vscode.Uri.file(filePath);
        const doc = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
    }

}

export const command_focusOnNode = vscode.commands.registerCommand(
  "dependencygraph.focusOnNode",
  (fileName, ancestors) => {
    //TODO fix index name with parent.
    messagePoster.newMsg({
      key: MESSAGE_FOCUS_ON_NODE,
      value: { fileName, ancestors },
    });
  }
);
export const command_reOpenView = vscode.commands.registerCommand(
  "dependencygraph.reOpenView",
  (fileName, fileData) => {
    if (global.dependencyTreeData) {
      reOpenWebViewWithTreeData(global.dependencyTreeData.dependencyTreeData);
    } else {
      reOpenWebViewWithTreeData(undefined);
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

    focusOnFile(_absolutePath);
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
