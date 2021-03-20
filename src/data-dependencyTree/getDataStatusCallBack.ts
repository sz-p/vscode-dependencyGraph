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
  msgGetSavedData,
} from "../utils/message/messages";
import {
  NO_DEPENDENCY,
  NO_FOLDER,
  NO_MAIN_FILE,
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
    onError(NO_MAIN_FILE);
    this.postMessage ? await statusMsgGetEntryFile.postError() : null;
  }
  async checkMainFileSuccess() {
    this.postMessage ? await statusMsgGetEntryFile.postSuccess() : null;
  }
  async checkGetDataFromFileError() {
    // onError(NO_MAIN_FILE);
    // this.postMessage ? await msgGetSavedData.post() : null;
  }
  async checkGetDataFromFileSuccess() {
    this.postMessage ? await msgGetSavedData.post() : null;
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
