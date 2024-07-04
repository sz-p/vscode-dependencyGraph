/**
 * @introduction get dependency tree data callback
 *
 * @description sen status\data to webview
 */
import {
  statusMsgGetDependencyProcessData,
  statusMsgGetEntryFile,
  statusMsgGetFolderPath,
  statusMsgGetPackageJsonPath,
  statusMsgStartGetDependencyTreeData,
  statusMsgStartPostDependencyTreeData,
  msgGetSavedData,
} from "../utils/message/messages";
import { messagePoster } from "../utils/message/messagePoster"
import {
  NO_DEPENDENCY,
  NO_FOLDER,
  NO_ENTRY_FILE,
  NO_PACKAGE_JSON,
} from "../utils/error/errorKey";
import { onError } from "../utils/error/onError";
export class StatusCallBack {
  private readonly postMessage: boolean | undefined;
  constructor(postMessage: boolean | undefined) {
    if (postMessage === undefined) {
      this.postMessage = true;
    }
    this.postMessage = postMessage;
  }
  async checkFolderPathSuccess() {
    this.postMessage ? await statusMsgGetFolderPath.postSuccess() : null;
  }
  async checkFolderPathError() {
    onError(NO_FOLDER);
    this.postMessage ? await statusMsgGetFolderPath.postError() : null;
  }
  async checkPackageJsonError() {
    onError(NO_PACKAGE_JSON);
    this.postMessage ? await statusMsgGetPackageJsonPath.postError() : null;
  }
  async checkPackageJsonSuccess() {
    this.postMessage ? await statusMsgGetPackageJsonPath.postSuccess() : null;
  }
  async checkMainFileError() {
    onError(NO_ENTRY_FILE);
    this.postMessage ? await statusMsgGetEntryFile.postError() : null;
  }
  async checkMainFileSuccess() {
    this.postMessage ? await statusMsgGetEntryFile.postSuccess() : null;
  }
  async checkGetDataFromFileError() {
    // onError(NO_ENTRY_FILE);
    // this.postMessage ? await msgGetSavedData.post() : null;
  }
  async checkGetDataFromFileSuccess() {
    this.postMessage ? msgGetSavedData() : null;
  }
  async startGetDependencyTreeDataSuccess() {
    this.postMessage ? await statusMsgStartGetDependencyTreeData.postSuccess() : null;
  }
  async StartPostDependencyTreeDataSuccess() {
    this.postMessage ? await statusMsgStartPostDependencyTreeData.postSuccess() : null;
  }
  async allStatusPosted() {
    this.postMessage ? await messagePoster.allMessagesPosted() : null;
  }
  async checkGetDataFromAnalyserError() {
    onError(NO_DEPENDENCY);
    this.postMessage
      ? await statusMsgGetDependencyProcessData.postError()
      : null;
  }
  async checkGetDataFromAnalyserSuccess() {
    this.postMessage
      ? await statusMsgGetDependencyProcessData.postSuccess()
      : null;
  }
}
