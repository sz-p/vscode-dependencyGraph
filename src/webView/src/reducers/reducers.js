import * as type from '../actions/actionType';
import initialState from './initialState';
const actionsCase = () => {
	const change_getDataStatus = (state, action) => {
		return Object.assign({}, state, {
			getDataStatus: action.payload
		});
	};
	return new Map([ [ type.TYPE_CHANGE_GET_DATA_STATUS, change_getDataStatus ] ]);
};
export const reducer = function(state = initialState, action) {
	const actionFunction = actionsCase().get(action.type);
	if (typeof actionFunction === 'function') {
		return actionFunction(state, action);
	} else {
		return state;
	}
};
