import * as MESSAGES from "./utils/message/messagesKeys";
import * as vscode from "vscode";
import { Msg } from "./utils/message/message";
import { setEntryFileRelativePath } from "./utils/config";
import * as path from "path";
import { onError } from "./utils/error/onError";
import { NO_FOLDER } from "./utils/error/errorKey";
const actionOpenFolder = function (msg: Msg) {
  vscode.commands.executeCommand("workbench.action.files.openFolder");
};
const actionSetEntryFile = async function (msg: Msg) {
  try {
    await setEntryFileRelativePath(msg.value);
  } catch (e) {
    onError(NO_FOLDER, e);
  }
  vscode.commands.executeCommand("framegraph.refreshFile");
};
const messageCase = () => {
  return new Map([
    [MESSAGES.MESSAGE_OPEN_FOLDER, actionOpenFolder],
    [MESSAGES.MESSAGE_SET_ENTRY_FILE, actionSetEntryFile],
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
