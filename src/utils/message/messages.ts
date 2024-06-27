import { messagePoster, StatusMessagePoster } from "./messagePoster";
import * as STATUS from "../../data-dependencyTree/statusType";
import * as MSG from "./messagesKeys";
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

export const msgRunCommandStatus = function (
  type: "setting" | "command" | "waiting",
  key: string,
  value: boolean
) {
  messagePoster.newMsg({ key: MSG.MESSAGE_RUN_COMMAND_STATUS, value: { type, key, value } })
}
export const msgGetSavedData = function () {
  messagePoster.newMsg({
    key: MSG.MESSAGE_IS_SAVED_DATA,
    value: true
  });
}
export const postSetting = function (setting: object) {
  messagePoster.newMsg({ key: MSG.MESSAGE_GET_ENTRY_FILE, value: setting });
};
