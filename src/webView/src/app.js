import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import { Provider } from 'react-redux';
import { reducer } from './reducers/reducers';
import { StatusView } from './components/statusView/statusView';
import { SettingView } from './components/settingView/settingView';
import { TreeView } from './components/treeView/treeView';
export const store = createStore(reducer, applyMiddleware(promiseMiddleware));
window.store = store;
export const App = function() {
	return (
		<Provider store={store}>
			<StatusView />
			<SettingView />
			<TreeView />
		</Provider>
	);
};
