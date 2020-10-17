import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import { reducer } from './reducers';
export const store = createStore(reducer, applyMiddleware(promiseMiddleware));
