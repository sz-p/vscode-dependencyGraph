import * as React from 'react';
import { Provider } from 'react-redux';
import { StatusView } from './components/statusView/statusView';
import { SettingView } from './components/settingView/settingView';
import { TreeView } from './components/treeView/treeView';
import { store } from './reducers/store';
export const App = function() {
	return (
		<Provider store={store}>
			<StatusView />
			<SettingView />
			<TreeView />
		</Provider>
	);
};
