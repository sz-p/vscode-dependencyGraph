import { MessagePoster, StatusMessagePoster } from "./messagePoster";
import { getActiveTheme } from "../setting/setting";
import * as STATUS from "../../data-dependencyTree/statusType";
import * as MSG from "./messagesKeys";
import * as vscode from "vscode";

export const statusMsgGetFolderPath = new StatusMessagePoster(
  STATUS.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER
);
export const statusMsgGetPackageJsonPath = new StatusMessagePoster(
  STATUS.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON
);
export const statusMsgGetEntryFile = new StatusMessagePoster(
  STATUS.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE
);
export const statusMsgGetDependencyData = new StatusMessagePoster(
  STATUS.STATUS_GET_DEPENDENCY_DATA_GET_DATA
);
export const statusMsgGetDependencyProcessData = new StatusMessagePoster(
  STATUS.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA
);

export const msgGetLanguage = new MessagePoster(
  MSG.MESSAGE_GET_LANGUAGE,
  vscode.env.language
);
export const msgGetActiveThemeKind = new MessagePoster(
  MSG.MESSAGE_GET_ACTIVE_THEME_KIND,
  getActiveTheme()
);
export const postSetting = function (setting: object) {
  const poster = new MessagePoster(MSG.MESSAGE_GET_ENTRY_FILE, setting);
  poster.post();
};
