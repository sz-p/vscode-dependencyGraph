import * as type from "../actions/actionType";
import { i18n } from "../../../i18n/i18n";
import { initialState } from "./initialState";
const actionsCase = () => {
  const change_getDataStatus = (state, action) => {
    const data = action.payload.data;
    let newState = undefined;
    if (data.value === "error" || data.value.status === "error") {
      newState = Object.assign({}, state, {
        getDataStatus: data.value,
        gotDependencyTreeData: false,
      });
    } else {
      newState = Object.assign({}, state, {
        getDataStatus: data.value,
      });
    }
    return newState;
  };
  const setDependencyTreeData = (state, action) => {
    const data = action.payload;
    let newState = undefined;
    if (data) {
      newState = Object.assign({}, state, {
        dependencyTreeData: data,
        gotDependencyTreeData: true,
      });
    } else {
      newState = Object.assign({}, state, {
        dependencyTreeData: undefined,
        gotDependencyTreeData: false,
      });
    }

    return newState;
  };
  const setFocusOnNode = (state, action) => {
    const data = action.payload.data;
    const newState = Object.assign({}, state, {
      focusOn: data.value,
    });
    return newState;
  };
  const setAssetBaseURL = (state, action) => {
    const data = action.payload.data;
    const newState = Object.assign({}, state, {
      assetsBaseURL: data.value,
    });
    return newState;
  };
  const setFolderPath = (state, action) => {
    const data = action.payload.data;
    const newState = Object.assign({}, state, {
      folderPath: data.value,
    });
    return newState;
  };
  const getWebViewHash = (state, action) => {
    const data = action.payload.data;
    const newState = Object.assign({}, state, {
      viewHash: data.value,
    });
    return newState;
  };
  const getLanguage = (state, action) => {
    const data = action.payload.data;
    i18n.setLanguage(data.value);
    const newState = Object.assign({}, state, {
      language: data.value,
    });
    return newState;
  };
  const getActiveThemeKind = (state, action) => {
    const data = action.payload.data;
    const newState = Object.assign({}, state, {
      activeThemeKind: data.value,
    });
    return newState;
  };
  const selectNode = (state, action) => {
    const data = action.payload.data;
    const newState = Object.assign({}, state, {
      selectedNode: data,
    });
    return newState;
  };
  const changeSettingStatus = (state, action) => {
    const newState = Object.assign({}, state, {
      showSetting: !state.showSetting,
    });
    return newState;
  };
  const getEntryFile = (state, action) => {
    const data = action.payload.data;
    const newState = Object.assign({}, state, {
      setting: data.value,
    });
    return newState;
  };
  const getSavedData = (state, action) => {
    const data = action.payload.data;
    const newState = Object.assign({}, state, {
      savedData: true,
    });
    return newState;
  };
  const getRunCommandStatus = (state, action) => {
    const data = action.payload.data;
    const newState = Object.assign({}, state, {
      commandSettingStatus: data.value,
    });
    return newState;
  };
  return new Map([
    [type.TYPE_CHANGE_GET_DATA_STATUS, change_getDataStatus],
    [type.TYPE_SET_DEPENDENCIES_TREE_DATA, setDependencyTreeData],
    [type.TYPE_SET_FOCUS_ON_NODE, setFocusOnNode],
    [type.TYPE_SET_ASSET_BASE_URL, setAssetBaseURL],
    [type.TYPE_SET_FOLDER_PATH, setFolderPath],
    [type.TYPE_GET_WEBVIEW_HASH, getWebViewHash],
    [type.TYPE_GET_LANGUAGE, getLanguage],
    [type.TYPE_GET_ACTIVE_THEME_KIND, getActiveThemeKind],
    [type.TYPE_SELECT_NODE, selectNode],
    [type.TYPE_CHANGE_SETTING_STATUS, changeSettingStatus],
    [type.TYPE_GET_ENTRY_FILE, getEntryFile],
    [type.TYPE_GET_SAVED_DATA, getSavedData],
    [type.TYPE_GET_RUN_COMMAND_STATUS, getRunCommandStatus],
  ]);
};
export const reducer = function (state = initialState, action) {
  const actionFunction = actionsCase().get(action.type);
  if (typeof actionFunction === "function") {
    return actionFunction(state, action);
  } else {
    console.log("unwatch action: ");
    console.log(action.type);
    return state;
  }
};
