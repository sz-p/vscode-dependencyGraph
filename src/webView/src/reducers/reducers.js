import * as type from '../actions/actionType';
import { i18n } from '../../../i18n/i18n';
import { initialState } from './store';
const actionsCase = () => {
	const change_getDataStatus = (state, action) => {
		const data = action.payload.data;
		let newState = undefined;
		if (data.value === 'error') {
			newState = Object.assign({}, state, {
				getDataStatus: data.value,
				gotDependencyTreeData: false
			});
		} else {
			newState = Object.assign({}, state, {
				getDataStatus: data.value
			});
		}
		return newState;
	};
	const setDependencyTreeData = (state, action) => {
		const data = action.payload.data;
		let newState = undefined;
		if (data.value) {
			newState = Object.assign({}, state, {
				dependencyTreeData: data.value,
				gotDependencyTreeData: true
			});
		} else {
			newState = Object.assign({}, state, {
				dependencyTreeData: data.value,
				gotDependencyTreeData: false
			});
		}

		return newState;
	};
	const setFocusOnNode = (state, action) => {
		const data = action.payload.data;
		const newState = Object.assign({}, state, {
			focusOn: data.value
		});
		return newState;
	};
	const setAssetBaseURL = (state, action) => {
		const data = action.payload.data;
		const newState = Object.assign({}, state, {
			assetsBaseURL: data.value
		});
		return newState;
	};
	const setFolderPath = (state, action) => {
		const data = action.payload.data;
		const newState = Object.assign({}, state, {
			folderPath: data.value
		});
		return newState;
	};
	const getWebViewHash = (state, action) => {
		const data = action.payload.data;
		const newState = Object.assign({}, state, {
			viewHash: data.value
		});
		return newState;
	};
	const getLanguage = (state, action) => {
		const data = action.payload.data;
    i18n.setLanguage(data.value);
		const newState = Object.assign({}, state, {
			language: data.value
		});
		return newState;
	};
	return new Map([
		[ type.TYPE_CHANGE_GET_DATA_STATUS, change_getDataStatus ],
		[ type.TYPE_SET_DEPENDENCIES_TREE_DATA, setDependencyTreeData ],
		[ type.TYPE_SET_FOCUS_ON_NODE, setFocusOnNode ],
		[ type.TYPE_SET_ASSET_BASE_URL, setAssetBaseURL ],
		[ type.TYPE_SET_FOLDER_PATH, setFolderPath ],
		[ type.TYPE_GET_WEBVIEW_HASH, getWebViewHash ],
		[ type.TYPE_GET_LANGUAGE, getLanguage ]
	]);
};
export const reducer = function(state = initialState, action) {
	const actionFunction = actionsCase().get(action.type);
	if (typeof actionFunction === 'function') {
		return actionFunction(state, action);
	} else {
		console.log('unwatch action: ');
		console.log(action.type);
		return state;
	}
};
