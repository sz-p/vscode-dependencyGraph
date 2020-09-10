import { ErrorKey } from './errorKey';
import { showMessage } from '../showMessage';
import { getText } from '../../i18n/i18n';

const getErrorMessage = function(errorKey: ErrorKey) {
	return getText(errorKey as string);
};
export const onError = function(errorKey: ErrorKey, message?: string, callback?: Function, callbackArg?: any) {
	let messageText = `${errorKey}: ${getErrorMessage(errorKey)}`;
	if (message) {
		messageText = messageText + `<br/>` + message;
	}
	showMessage(messageText);
	if (callback) {
		callback(callbackArg);
	}
};
