import * as vscode from 'vscode';
import { zhcn } from './zh-cn/zh-cn';
import { engl } from './en-gl/en-gl';
export const getCurrentLanguage = (): string => vscode.env.language;
let LANGUAGE = getCurrentLanguage();
export function getText(text: string) {
	if (LANGUAGE === 'en-gl') {
		return engl[text];
	} else if (LANGUAGE === 'zh-cn') {
		return zhcn[text] || engl[text];
	}
}
