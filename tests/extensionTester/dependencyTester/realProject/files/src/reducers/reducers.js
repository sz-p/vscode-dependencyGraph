/*

Reducers 指定了应用状态的变化如何响应 actions 并发送到 store 的，记住 actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新 state。

*/

import * as type from '../actions/actionType';
import initialState from './initialState';
import footboolData from '../components/datas/football.json';
import blocksforce from '../components/datas/blOcksForce.json';
import zachary from '../components/datas/zachary.json';

const actionsCase = () => {
	const change_data = (state, action) => {
		console.log(action.payload);
		let data = undefined;
		if (action.payload === '足球俱乐部') {
			data = JSON.parse(JSON.stringify(footboolData));
		}
		if (action.payload === '跆拳道俱乐部') {
			data = JSON.parse(JSON.stringify(zachary));
		}
		if (action.payload === '力学图引用') {
			data = JSON.parse(JSON.stringify(blocksforce));
		}
		return Object.assign({}, state, {
			data
		});
	};
	const change_dimension = (state, action) => {
		console.log(action.payload);
		return Object.assign({}, state, {
			dimension: action.payload
		});
	};
	return new Map([ [ type.change_data, change_data ], [ type.change_dimension, change_dimension ] ]);
};
function reducer(state = initialState, action) {
	const actionFunction = actionsCase().get(action.type);
	if (typeof actionFunction === 'function') {
		return actionFunction(state, action);
	} else {
		return state;
	}
}

export default reducer;
