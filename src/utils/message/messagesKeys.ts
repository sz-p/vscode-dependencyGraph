export class MsgKey extends String {
	constructor(value?: any) {
		super(value);
	}
}
export const MESSAGE_GET_DATA_STATUS = new MsgKey('MESSAGE_GET_DATA_STATUS');
export const MESSAGE_DEPENDENCY_TREE_DATA = new MsgKey('MESSAGE_DEPENDENCY_TREE_DATA');
export const MESSAGE_FOCUS_ON_NODE = new MsgKey('MESSAGE_FOCUS_ON_NODE');
export const MESSAGE_ASSETS_BASE_URL = new MsgKey('MESSAGE_ASSETS_BASE_URL');
