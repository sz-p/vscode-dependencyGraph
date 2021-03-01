import { Msg } from "./message";
import { onError } from "../error/onError";
import { NO_WEBVIEW_PANEL } from "../error/errorKey";
import { StatusKey } from "../../data-dependencyTree/statusType";
import { MsgKey, MESSAGE_GET_DATA_STATUS } from "./messagesKeys";
const postMessage = async function (msg: Msg) {
  if (global.webViewPanel) {
    await global.webViewPanel.webview.postMessage(msg);
  } else {
    onError(NO_WEBVIEW_PANEL);
  }
};
export class MessagePoster {
  msg: {
    key: MsgKey;
    value: any;
    description: string | undefined;
  };
  constructor(key: MsgKey, value: any, description?: string) {
    this.msg = {
      key: key,
      value: value,
      description: description,
    };
  }
  async post() {
    await postMessage(this.msg);
  }
}
export class StatusMessagePoster {
  msg: {
    key: MsgKey;
    value: {
      type: StatusKey;
      status: "error" | "success";
    };
    description: string | undefined;
  };
  constructor(statusKey: StatusKey, description?: string) {
    this.msg = {
      key: MESSAGE_GET_DATA_STATUS,
      value: {
        type: statusKey,
        status: "error",
      },
      description: description,
    };
  }
  async postSuccess() {
    this.msg.value.status = "success";
    await postMessage(this.msg);
  }
  async postError() {
    this.msg.value.status = "error";
    await postMessage(this.msg);
  }
}
