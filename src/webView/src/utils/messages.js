import {
  MESSAGE_OPEN_FOLDER,
  MESSAGE_SET_SETTING,
  MESSAGE_OPEN_FILE_FROM_WEBVIEW,
  MESSAGE_SAVE_DATA,
  MESSAGE_UPDATE_DATA,
  MESSAGE_EXPORT_SVG,
  MESSAGE_EXPORT_PNG,
  MESSAGE_WEBVIEW_LOG,
  MESSAGE_WEBVIEW_READY,
} from "../../../utils/message/messagesKeys";
class Msg {
  constructor(key, value, description) {
    this.msg = {
      key: key,
      value: value,
      description: description,
    };
  }
  async post() {
    await window.vscode.postMessage(this.msg);
  }
}
export const msgOpenFolder = new Msg(MESSAGE_OPEN_FOLDER, true);
export const msgSaveData = new Msg(MESSAGE_SAVE_DATA, true);
export const msgUpDateData = new Msg(MESSAGE_UPDATE_DATA, true);
export const msgWebViewReady = new Msg(MESSAGE_WEBVIEW_READY, true);
export const msgSetSetting = (key, value) =>
  new Msg(MESSAGE_SET_SETTING, { key, value });
export const msgOpenFileInView = (value) =>
  new Msg(MESSAGE_OPEN_FILE_FROM_WEBVIEW, value);
export const msgExportSvg = (value) => new Msg(MESSAGE_EXPORT_SVG, value);
export const msgExportPng = (value) => new Msg(MESSAGE_EXPORT_PNG, value);
export const msgWebViewLog = (value, description) => {
  const messagePoster = new Msg(MESSAGE_WEBVIEW_LOG, value, description);
  messagePoster.post();
};
