import { webViewPanel } from '../initExtension';

export const postMessage = function(msg: object) {
	webViewPanel.webview.postMessage(msg);
};
