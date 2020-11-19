import * as vscode from "vscode";
export const showMessage = function (message: string): void {
  vscode.window.showInformationMessage(message);
};
