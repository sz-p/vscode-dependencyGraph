/**
 * @introduction Show error module
 *
 * @description show extension error
 */
import { ErrorKey } from "./errorKey";
import { showMessage } from "../showMessage";
import { i18n } from "../../i18n/i18n";

const getErrorMessage = function (errorKey: ErrorKey) {
  return i18n.getText(errorKey as string);
};
export const onError = function (
  errorKey: ErrorKey,
  message?: string,
  callback?: Function,
  callbackArg?: any
) {
  let messageText = `${errorKey}: ${getErrorMessage(errorKey)}`;
  if (message) {
    messageText = messageText + `<br/>` + message;
  }
  showMessage(messageText, 'error');
  if (callback) {
    callback(callbackArg);
  }
};
