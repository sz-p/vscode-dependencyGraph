import { createAction } from 'redux-actions';
import * as type from './actionType';

const returnParams = function(Params) {
	return Params;
};

export const action_changeGetDataStatus = createAction(type.TYPE_CHANGE_GET_DATA_STATUS, returnParams)(params);
