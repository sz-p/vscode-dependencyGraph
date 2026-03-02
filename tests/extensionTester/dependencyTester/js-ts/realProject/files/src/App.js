import React from 'react';
import './App.css';

import IndexPage from './pages/index/index';
import Controller from './components/controller/controller';

import { hot } from 'react-hot-loader';

import reducer from './reducers/reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';

import { BrowserRouter, Route, Switch } from 'react-router-dom';

const createLocalStore = function() {
	if (process.env.NODE_ENV === 'production') {
		return createStore(reducer, applyMiddleware(promiseMiddleware));
	} else {
		return createStore(reducer, composeWithDevTools(applyMiddleware(promiseMiddleware)));
	}
};
export const store = createLocalStore();

function App() {
	return (
		<Provider store={store}>
			<BrowserRouter basename={window.location.pathname}>
				<div id="container">
					<Controller />
					<IndexPage />
				</div>
			</BrowserRouter>
		</Provider>
	);
}

export default hot(module)(App);
