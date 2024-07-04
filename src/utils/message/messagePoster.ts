import { Msg } from "./message";
import { onError } from "../error/onError";
import { NO_WEBVIEW_PANEL } from "../error/errorKey";
import { StatusKey } from "../../data-dependencyTree/statusType";
import { MsgKey, MESSAGE_GET_DATA_STATUS } from "./messagesKeys";
import { logger } from "../logger";
import { waitTime } from "../utils";
class MessagePoster {
  messagesQueue: Msg[];
  status: 'posting' | 'emptyMessagesQueue' | 'waitingWebViewPanel' | 'waitingWebViewReady';
  constructor() {
    this.messagesQueue = [];
  }
  newMsg(msg: Msg) {
    this.messagesQueue.push(msg);
    this.startPost();
  }
  async allMessagesPosted() {
    while (this.messagesQueue.length !== 0) {
      await waitTime(0)
    }
  }
  clearMessagesQueue() {
    this.messagesQueue = [];
  }
  async startPost() {
    if (this.status !== 'posting') {
      this.status = 'posting';
      while (this.messagesQueue.length) {
        if (global.webViewPanel) {
          if (global.webViewReady) {
            let ms = this.messagesQueue.shift();
            logger.debug({
              "POST-MESSAGE-TO-WEBVIEW-KEY": ms.key,
              "POST-MESSAGE-TO-WEBVIEW-VALUE": ms.value
            })
            const postMessageStatus = await global.webViewPanel.webview.postMessage(ms);
            if (!postMessageStatus) {
              logger.error("NO_WEBVIEW_PANEL")
              onError(NO_WEBVIEW_PANEL);
            }
          } else {
            logger.debug("webView is not ready")
            await waitTime(10)
            this.status = 'waitingWebViewReady';
          }
        }
        else {
          logger.error("webview panel is not ready")
          await waitTime(10)
          this.status = 'waitingWebViewPanel';
          break;
        }
      }
      this.status = 'emptyMessagesQueue';
    }
  }
}
export const messagePoster = new MessagePoster();
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
    await messagePoster.newMsg(this.msg);
  }
  async postError() {
    this.msg.value.status = "error";
    await messagePoster.newMsg(this.msg);
  }
}
