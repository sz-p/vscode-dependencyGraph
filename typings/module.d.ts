import * as vscode from 'vscode';
import { DependencyTreeData } from '../src/data-dependencyTree/dependencyTreeData';
declare module '*.html' {
	const content: string;
	export default content;
}

declare global {
	namespace NodeJS {
		interface Global {
			webViewPanel: vscode.WebviewPanel | undefined;
			dependencyTreeData: DependencyTreeData | undefined;
		}
	}
}
