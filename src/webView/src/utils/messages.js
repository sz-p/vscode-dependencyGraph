import {
  MESSAGE_OPEN_FOLDER,
  MESSAGE_SET_SETTING,
  MESSAGE_OPEN_FILE_FROM_WEBVIEW,
} from "../../../utils/message/messagesKeys";
class Msg {
  constructor(key, value, description) {
    this.msg = {
      key: key,
      value: value,
      description: description,
    };
  }
  post() {
    window.vscode.postMessage(this.msg);
  }
}
export const msgOpenFolder = new Msg(MESSAGE_OPEN_FOLDER, true);
export const msgSetSetting = (key, value) =>
  new Msg(MESSAGE_SET_SETTING, { key, value });
export const msgOpenFileInView = (value) =>
  new Msg(MESSAGE_OPEN_FILE_FROM_WEBVIEW, value);
