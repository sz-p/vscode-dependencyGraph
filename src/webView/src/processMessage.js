import * as action from './actions/action.js';
import * as MESSAGES from '../../utils/messagesKeys';
import { store } from './app';
const messageCase = () => {
	return new Map([
		[ MESSAGES.MESSAGE_GETDATASTATUS, action.action_changeGetDataStatus ],
		[ MESSAGES.MESSAGE_DEPENDENCYTREEDATA, action.action_setDependenciesTreeData ]
	]);
};

export const processMessage = function(event) {
	const messageFunction = messageCase().get(event.data.key);
	if (typeof messageFunction === 'function') {
		store.dispatch(messageFunction(event));
	} else {
		console.log('unwatch message: ');
		console.log(event.data);
		console.log(MESSAGES.MESSAGE_GETDATASTATUS);
		console.log(event);
	}
};
