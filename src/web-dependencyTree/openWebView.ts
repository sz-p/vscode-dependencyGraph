/**
 * @description create a web view to show frame graph
 */
import * as vscode from 'vscode';
import * as paths from '../paths';
import * as path from 'path';
import * as fs from 'fs';
// const htmlText = require('./index.html');
import { webViewHTMLPath } from '../paths';

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} templatePath 相对于插件根目录的html文件绝对路径
 */
function getWebViewContent(templatePath: string) {
	const dirPath = path.dirname(templatePath);
	let html = fs.readFileSync(templatePath, 'utf-8');
	// vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
	html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
		return $1 + vscode.Uri.file(path.resolve(dirPath, $2)).with({ scheme: 'vscode-resource' }).toString() + '"';
	});
	return html;
}

/**
 * @description create view
 */
const createView = function(webViewPanel: vscode.WebviewPanel): void {
	webViewPanel.iconPath = vscode.Uri.file(paths.framegraphPNG);
	webViewPanel.webview.html = getWebViewContent(webViewHTMLPath);
};

export { createView };
