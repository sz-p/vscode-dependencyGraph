/**
 * @introduction process webview messages
 *
 * @description get webview message.\n processing command or setting
 */
import * as MESSAGES from "./utils/message/messagesKeys";
import * as vscode from "vscode";
import { Msg } from "./utils/message/message.d";
import { setSetting } from "./utils/fileSystem/setting";
import { SETTING_KEY_ENTRY_FILE_PATH } from "./utils/fileSystem/settingKey";
import { onError } from "./utils/error/onError";
import { NO_FOLDER } from "./utils/error/errorKey";
import { exportSvg, exportPng } from "./utils/fileSystem/svgAndPng";
import { msgRunCommandStatus } from "./utils/message/messages";

/**
 * get command open folder
 *
 * @param {Msg} msg
 */
const actionOpenFolder = function (msg: Msg) {
  vscode.commands.executeCommand("workbench.action.files.openFolder");
};

/**
 * get command set entry file
 *
 * @param {Msg} msg
 */
const actionOpenFile = function (msg: Msg) {
  vscode.commands.executeCommand("framegraph.openFileInView", msg.value);
};

const actionSetSetting = async function (msg: Msg) {
  // don't get message from client from web view click
  // msgRunCommandStatus("waiting", msg.value.key, true).post();
  try {
    await setSetting(msg.value.key, msg.value.value);
    msgRunCommandStatus("setting", msg.value.key, true).post();
  } catch (e) {
    msgRunCommandStatus("setting", msg.value.key, false).post();
    onError(NO_FOLDER, e);
  }
  if (msg.value.key === SETTING_KEY_ENTRY_FILE_PATH) {
    vscode.commands.executeCommand("framegraph.refreshFile");
  }
};
const actionExportSvg = async function (msg: Msg) {
  // don't get message from client from web view click
  // msgRunCommandStatus("waiting", msg.key, true).post();
  try {
    await exportSvg(msg.value);
    msgRunCommandStatus("command", msg.key, true).post();
  } catch (e) {
    msgRunCommandStatus("command", msg.key, false).post();
  }
};
const actionExportPng = async function (msg: Msg) {
  // don't get message from client from web view click
  // msgRunCommandStatus("waiting", msg.key, true).post();
  try {
    await exportPng(msg.value);
    msgRunCommandStatus("command", msg.key, true).post();
  } catch (e) {
    msgRunCommandStatus("command", msg.key, false).post();
  }
};
const actionSaveData = async function (msg: Msg) {
  // don't get message from client from web view click
  // msgRunCommandStatus("waiting", msg.key, true).post();
  try {
    await vscode.commands.executeCommand("framegraph.saveData");
    msgRunCommandStatus("command", msg.key, true).post();
  } catch (e) {
    msgRunCommandStatus("command", msg.key, false).post();
  }
};
const actionUpDateData = async function (msg: Msg) {
  // don't get message from client from web view click
  // msgRunCommandStatus("waiting", msg.key, true).post();
  try {
    await vscode.commands.executeCommand("framegraph.upDateData");
    msgRunCommandStatus("command", msg.key, true).post();
  } catch (e) {
    msgRunCommandStatus("command", msg.key, false).post();
  }
};
const messageCase = () => {
  return new Map([
    [MESSAGES.MESSAGE_OPEN_FILE_FROM_WEBVIEW, actionOpenFile],
    [MESSAGES.MESSAGE_OPEN_FOLDER, actionOpenFolder],
    [MESSAGES.MESSAGE_SET_SETTING, actionSetSetting],
    [MESSAGES.MESSAGE_SAVE_DATA, actionSaveData],
    [MESSAGES.MESSAGE_UPDATE_DATA, actionUpDateData],
    [MESSAGES.MESSAGE_EXPORT_SVG, actionExportSvg],
    [MESSAGES.MESSAGE_EXPORT_PNG, actionExportPng],
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
