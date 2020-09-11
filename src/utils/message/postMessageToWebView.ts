import { NO_WEBVIEW_PANEL } from '../error/errorKey';
import { onError } from '../error/onError';

import { MsgToWebView } from './message';
export const postMessage = function(msg: MsgToWebView) {
	if (global.webViewPanel) {
		global.webViewPanel.webview.postMessage(msg);
	}
};
export const postMessageCatchError = function(msg: MsgToWebView) {
	if (global.webViewPanel) {
		global.webViewPanel.webview.postMessage(msg);
	} else {
		onError(NO_WEBVIEW_PANEL);
	}
};
