import { NO_WEBVIEW_PANEL } from "../error/errorKey";
import { onError } from "../error/onError";

import { Msg } from "./message";
export const postMessage = async function (msg: Msg) {
  if (global.webViewPanel) {
    await global.webViewPanel.webview.postMessage(msg);
  }
};
export const postMessageCatchError = async function (msg: Msg) {
  if (global.webViewPanel) {
    await global.webViewPanel.webview.postMessage(msg);
  } else {
    onError(NO_WEBVIEW_PANEL);
  }
};
