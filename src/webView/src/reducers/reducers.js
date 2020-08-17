import * as type from '../actions/actionType';
import initialState from './initialState';
const actionsCase = () => {
	const change_getDataStatus = (state, action) => {
		const data = action.payload.data;
		const newState = Object.assign({}, state, {
			getDataStatus: data.value
		});
		return newState;
	};
	const setDependencyTreeData = (state, action) => {
		const data = action.payload.data;
		const newState = Object.assign({}, state, {
			dependencyTreeData: data.value
		});
		return newState;
	};
	return new Map([
		[ type.TYPE_CHANGE_GET_DATA_STATUS, change_getDataStatus ],
		[ type.TYPE_SET_DEPENDENCIES_TREE_DATA, setDependencyTreeData ]
	]);
};
export const reducer = function(state = initialState, action) {
	const actionFunction = actionsCase().get(action.type);
	if (typeof actionFunction === 'function') {
		return actionFunction(state, action);
	} else {
		console.log('unwatch action: ');
		console.log(action);
		return state;
	}
};
