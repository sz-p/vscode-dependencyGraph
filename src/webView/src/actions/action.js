import { createAction } from 'redux-actions';
import * as type from './actionType';

const returnParams = function(Params) {
	return Params;
};

export const action_changeGetDataStatus = createAction(type.TYPE_CHANGE_GET_DATA_STATUS, returnParams);
export const action_setDependenciesTreeData = createAction(type.TYPE_SET_DEPENDENCIES_TREE_DATA, returnParams);
export const action_setFocusOnNode = createAction(type.TYPE_SET_FOCUS_ON_NODE, returnParams);
