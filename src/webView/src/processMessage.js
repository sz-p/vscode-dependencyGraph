import * as action from "./actions/action.js";
import * as MESSAGES from "../../utils/message/messagesKeys";
import { store } from "./reducers/store";
const messageCase = () => {
  return new Map([
    [MESSAGES.MESSAGE_GET_DATA_STATUS, action.action_changeGetDataStatus],
    [
      MESSAGES.MESSAGE_DEPENDENCY_TREE_DATA,
      action.action_setDependenciesTreeData,
    ],
    [MESSAGES.MESSAGE_FOCUS_ON_NODE, action.action_setFocusOnNode],
    [MESSAGES.MESSAGE_ASSETS_BASE_URL, action.action_setAssetBaseURL],
    [MESSAGES.MESSAGE_FOLDER_PATH, action.action_setFolderPath],
    [MESSAGES.MESSAGE_UPDATE_WEBVIEW, action.action_getVewViewHash],
    [MESSAGES.MESSAGE_GET_LANGUAGE, action.action_getLanguage],
    [MESSAGES.MESSAGE_GET_ENTRY_FILE, action.action_getEntryFile],
    [MESSAGES.MESSAGE_GET_ACTIVE_THEME_KIND, action.action_getActiveThemeKind],
    [MESSAGES.MESSAGE_IS_SAVED_DATA, action.action_getSavedData],
  ]);
};

export const processMessage = function (event) {
  const messageFunction = messageCase().get(event.data.key);
  if (typeof messageFunction === "function") {
    store.dispatch(messageFunction(event));
  } else {
    window.console.log("unwatch message: ");
    window.console.log(event.data);
  }
};
