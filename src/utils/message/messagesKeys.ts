type Opaque<Type, Token = unknown> = Type & {readonly __TYPE__: Token}
export type MsgKey = Opaque<string, 'MsgKey'>;
export const MESSAGE_GET_DATA_STATUS = 'MESSAGE_GET_DATA_STATUS' as MsgKey;
export const MESSAGE_DEPENDENCY_TREE_DATA = 'MESSAGE_DEPENDENCY_TREE_DATA' as MsgKey;
export const MESSAGE_FOCUS_ON_NODE = 'MESSAGE_FOCUS_ON_NODE' as MsgKey;
export const MESSAGE_ASSETS_BASE_URL = 'MESSAGE_ASSETS_BASE_URL' as MsgKey;
export const MESSAGE_FOLDER_PATH = 'MESSAGE_FOLDER_PATH' as MsgKey;
