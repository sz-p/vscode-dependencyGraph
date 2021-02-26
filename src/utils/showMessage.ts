import * as vscode from "vscode";
export const showMessage = async function (message: string): Promise<void> {
  await vscode.window.showInformationMessage(message);
};
