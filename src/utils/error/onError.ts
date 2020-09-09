import { ErrorKey } from './errorKey';
import { showMessage } from '../showMessage';
export const onError = function(errorKey: ErrorKey, message: string, callback?: Function, callbackArg?: any) {
	const messageText = `${errorKey}: ${message}`;
	showMessage(messageText);
	if (callback) {
		callback(callbackArg);
	}
};
