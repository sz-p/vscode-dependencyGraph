import { MsgKey } from './messagesKeys';
export interface MsgToWebView {
	key: MsgKey;
	value: any;
	description?: string;
}
