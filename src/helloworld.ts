import * as vscode from 'vscode';

const helloWorld = vscode.commands.registerCommand('extension.helloWorld', () => {
  vscode.window.showInformationMessage('Hello World!');
});
export {
  helloWorld
};