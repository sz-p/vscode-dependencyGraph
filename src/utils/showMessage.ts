import * as vscode from "vscode";
export const showMessage = async function (message: string, type: 'error' | 'info' | 'warring' = "info"): Promise<void> {
  switch (type) {
    case 'error': {
      await vscode.window.showErrorMessage(message);
      break;
    };
    case 'info': {
      await vscode.window.showInformationMessage(message);
      break;
    };
    case 'warring': {
      await vscode.window.showWarningMessage(message);
      break;
    }
  }
};
