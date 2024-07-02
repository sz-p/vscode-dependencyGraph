import { createAction } from "redux-actions";
import * as type from "./actionType";
import { transportsDataToDependenciesTreeData } from "../../../data-dependencyTree/processTreeData.ts";
import { msgWebViewLog } from "../utils/messages.js";
const returnParams = function (Params) {
  return Params;
};
const getDependenciesTreeData = function (Params) {
  try {
    msgWebViewLog("debug", "start transportsDataToDependenciesTreeData")
    const data = transportsDataToDependenciesTreeData(
      Params.data.value.data.dependencyTree,
      Params.data.value.data.dependencyNodes,
      Params.data.value.folderPath
    );
    msgWebViewLog("debug", "end transportsDataToDependenciesTreeData")
    return data;
  } catch (error) {
    msgWebViewLog("error", "transportsDataToDependenciesTreeData error", error)
    return false;
  }
};
const getCommandWaitingStatus = function (key) {
  return {
    data: {
      value: {
        type: "waiting",
        key: key,
        value: true,
      },
    },
  };
};
export const action_changeGetDataStatus = createAction(
  type.TYPE_CHANGE_GET_DATA_STATUS,
  returnParams
);
export const action_setDependenciesTreeData = createAction(
  type.TYPE_SET_DEPENDENCIES_TREE_DATA,
  getDependenciesTreeData
);
export const action_setFocusOnNode = createAction(
  type.TYPE_SET_FOCUS_ON_NODE,
  returnParams
);
export const action_setAssetBaseURL = createAction(
  type.TYPE_SET_ASSET_BASE_URL,
  returnParams
);
export const action_setFolderPath = createAction(
  type.TYPE_SET_FOLDER_PATH,
  returnParams
);
export const action_getVewViewHash = createAction(
  type.TYPE_GET_WEBVIEW_HASH,
  returnParams
);
export const action_getLanguage = createAction(
  type.TYPE_GET_LANGUAGE,
  returnParams
);
export const action_getActiveThemeKind = createAction(
  type.TYPE_GET_ACTIVE_THEME_KIND,
  returnParams
);
export const action_selectNode = createAction(
  type.TYPE_SELECT_NODE,
  returnParams
);

export const action_changeSettingStatus = createAction(
  type.TYPE_CHANGE_SETTING_STATUS,
  returnParams
);
export const action_getEntryFile = createAction(
  type.TYPE_GET_ENTRY_FILE,
  returnParams
);
export const action_getSavedData = createAction(
  type.TYPE_GET_SAVED_DATA,
  returnParams
);

export const action_getRunCommandStatus = createAction(
  type.TYPE_GET_RUN_COMMAND_STATUS,
  returnParams
);

export const action_getCommandWaitingStatus = createAction(
  type.TYPE_GET_RUN_COMMAND_STATUS,
  getCommandWaitingStatus
);
