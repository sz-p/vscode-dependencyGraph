export interface msgToWebView {
	key: string;
	value: any;
	description?: string;
}

export const postMessage = function(msg: msgToWebView) {
	if (global.webViewPanel) {
		global.webViewPanel.webview.postMessage(msg);
	}
};
