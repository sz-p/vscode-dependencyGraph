import { MsgToWebView } from './message';
export const postMessage = function(msg: MsgToWebView) {
	if (global.webViewPanel) {
		global.webViewPanel.webview.postMessage(msg);
	}
};
