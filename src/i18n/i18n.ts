import { zhcn } from './zh-cn/zh-cn';
import { engl } from './en-gl/en-gl';

export function getText(text: string) {
	const LANGUAGE = 'en-gl';
	if (LANGUAGE === 'en-gl') {
		return engl[text];
	} else if (LANGUAGE === 'zh-cn') {
		return zhcn[text] || engl[text];
	}
}
