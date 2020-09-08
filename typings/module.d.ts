import * as vscode from 'vscode';
declare module '*.html' {
	const content: string;
	export default content;
}

declare global {
	namespace NodeJS {
		interface Global {
			webViewPanel: vscode.WebviewPanel | undefined;
		}
	}
}
