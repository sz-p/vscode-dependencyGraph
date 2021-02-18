import * as MESSAGES from "./utils/message/messagesKeys";
import * as vscode from "vscode";
import { Msg } from "./utils/message/message";
import { setSetting } from "./utils/setting/setting";
import { onError } from "./utils/error/onError";
import { NO_FOLDER } from "./utils/error/errorKey";
import { exportSvg, exportPng } from "./utils/data/svgAndPng";
const actionOpenFolder = function (msg: Msg) {
  vscode.commands.executeCommand("workbench.action.files.openFolder");
};
const actionSetSetting = async function (msg: Msg) {
  try {
    await setSetting(msg.value.key, msg.value.value);
  } catch (e) {
    onError(NO_FOLDER, e);
  }
  vscode.commands.executeCommand("framegraph.refreshFile");
};
const actionExportSvg = function (msg: Msg) {
  exportSvg(msg.value)
}
const actionExportPng = function (msg: Msg) {
  exportPng(msg.value)
}
const actionOpenFile = function (msg: Msg) {
  vscode.commands.executeCommand("framegraph.openFileInView", msg.value);
};
const actionSaveData = function (msg: Msg) {
  vscode.commands.executeCommand("framegraph.saveData");
};
const actionUpDateData = function (msg: Msg) {
  vscode.commands.executeCommand("framegraph.upDateData");
}
const messageCase = () => {
  return new Map([
    [MESSAGES.MESSAGE_OPEN_FILE_FROM_WEBVIEW, actionOpenFile],
    [MESSAGES.MESSAGE_OPEN_FOLDER, actionOpenFolder],
    [MESSAGES.MESSAGE_SET_SETTING, actionSetSetting],
    [MESSAGES.MESSAGE_SAVE_DATA, actionSaveData],
    [MESSAGES.MESSAGE_UPDATE_DATA, actionUpDateData],
    [MESSAGES.MESSAGE_EXPORT_SVG, actionExportSvg],
    [MESSAGES.MESSAGE_EXPORT_PNG, actionExportPng]
  ]);
};

export const processMessage = function (msg: Msg) {
  const messageFunction = messageCase().get(msg.key);
  if (typeof messageFunction === "function") {
    messageFunction(msg);
  } else {
    console.log("unwatch message: ");
    console.log(msg.key);
  }
};
