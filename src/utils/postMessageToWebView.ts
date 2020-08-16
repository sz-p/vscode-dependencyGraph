import { webViewPanel } from '../initExtension';

export interface msgToWebView {
	key: string;
	value: any;
	description?: string;
}

export const postMessage = function(msg: msgToWebView) {
	webViewPanel.webview.postMessage(msg);
};
