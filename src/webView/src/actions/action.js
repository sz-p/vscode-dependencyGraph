import { createAction } from 'redux-actions';
import * as type from './actionType';

const returnParams = function(Params) {
	return Params;
};

export const action_changeGetDataStatus = createAction(type.TYPE_CHANGE_GET_DATA_STATUS, returnParams);
export const action_setDependenciesTreeData = createAction(type.TYPE_SET_DEPENDENCIES_TREE_DATA, returnParams);
export const action_setFocusOnNode = createAction(type.TYPE_SET_FOCUS_ON_NODE, returnParams);
export const action_setAssetBaseURL = createAction(type.TYPE_SET_ASSET_BASE_URL, returnParams);
export const action_setFolderPath = createAction(type.TYPE_SET_FOLDER_PATH, returnParams);
export const action_getVewViewHash = createAction(type.TYPE_GET_WEBVIEW_HASH, returnParams);
export const action_getLanguage = createAction(type.TYPE_GET_LANGUAGE, returnParams)
