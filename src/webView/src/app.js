import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import { Provider } from 'react-redux';
import { reducer } from './reducers/reducers';

const store = createStore(reducer, applyMiddleware(promiseMiddleware));

function App() {
	return (
		<Provider store={store}>
			<div>hello react</div>
		</Provider>
	);
}

export { App };
