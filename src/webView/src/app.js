import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import { Provider } from 'react-redux';
import { reducer } from './reducers/reducers';

export const store = createStore(reducer, applyMiddleware(promiseMiddleware));
window.store = store;
export const App = function() {
	return (
		<Provider store={store}>
			<div>hello react</div>
		</Provider>
	);
};
