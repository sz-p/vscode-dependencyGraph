import { MESSAGE_OPEN_FOLDER, MESSAGE_SET_ENTRY_FILE } from '../../../utils/message/messagesKeys';
class Msg {
	constructor(key, value, description) {
		this.msg = {
			key: key,
			value: value,
			description: description
		};
	}
	post() {
		window.vscode.postMessage(this.msg);
	}
}
export const msgOpenFolder = new Msg(MESSAGE_OPEN_FOLDER, true);
export const msgSetEntryFile = (value) => new Msg(MESSAGE_SET_ENTRY_FILE, value);
