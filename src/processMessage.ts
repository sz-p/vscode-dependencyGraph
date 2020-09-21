import * as MESSAGES from './utils/message/messagesKeys';
import * as vscode from 'vscode';
import { Msg } from './utils/message/message';
const actionOpenFolder = function(msg: Msg) {
	vscode.commands.executeCommand('workbench.action.files.openFolder');
};
const messageCase = () => {
	return new Map([ [ MESSAGES.MESSAGE_OPEN_FOLDER, actionOpenFolder ] ]);
};

export const processMessage = function(msg: Msg) {
	const messageFunction = messageCase().get(msg.key);
	if (typeof messageFunction === 'function') {
		messageFunction(msg);
	} else {
		console.log('unwatch message: ');
		console.log(msg.key);
	}
};
