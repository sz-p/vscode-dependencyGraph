import { messagePoster, StatusMessagePoster } from "./messagePoster";
import * as STATUS from "../../data-dependencyTree/statusType";
import { getCurrentFolderPath } from "../../utils/getCurrentFolderPath";
import * as MSG from "./messagesKeys";
import { DependencyNodes, DependencyTree } from "../../data-dependencyTree/dependencyTreeData";
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
export const statusMsgStartGetDependencyTreeData = new StatusMessagePoster(
  STATUS.STATUS_START_GET_DEPENDENCY_DATA
);
export const statusMsgStartPostDependencyTreeData = new StatusMessagePoster(
  STATUS.STATUS_START_POST_DEPENDENCY_DATA
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

export const msgPostDependencyTreeDataToWebView = function (data?: {
  dependencyTree: DependencyTree;
  dependencyNodes: DependencyNodes;
}) {
  if (data === undefined) {
    data = global.dependencyTreeData?.transportsData
  }
  statusMsgStartPostDependencyTreeData.postSuccess();
  const folderPath = getCurrentFolderPath();
  messagePoster.newMsg({
    key: MSG.MESSAGE_DEPENDENCY_TREE_DATA,
    value: {
      data,
      folderPath,
    },
  });
}
