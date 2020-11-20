import { NO_WEBVIEW_PANEL } from "../error/errorKey";
import { onError } from "../error/onError";

import { Msg } from "./message";
export const postMessage = function (msg: Msg) {
  if (global.webViewPanel) {
    global.webViewPanel.webview.postMessage(msg);
  }
};
export const postMessageCatchError = function (msg: Msg) {
  if (global.webViewPanel) {
    global.webViewPanel.webview.postMessage(msg);
  } else {
    onError(NO_WEBVIEW_PANEL);
  }
};
