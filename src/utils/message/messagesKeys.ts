type Opaque<Type, Token = unknown> = Type & { readonly __TYPE__: Token };
export type MsgKey = Opaque<string, 'MsgKey'>;
export const MESSAGE_GET_DATA_STATUS = 'MESSAGE_GET_DATA_STATUS' as MsgKey;
export const MESSAGE_DEPENDENCY_TREE_DATA = 'MESSAGE_DEPENDENCY_TREE_DATA' as MsgKey;
export const MESSAGE_FOCUS_ON_NODE = 'MESSAGE_FOCUS_ON_NODE' as MsgKey;
export const MESSAGE_ASSETS_BASE_URL = 'MESSAGE_ASSETS_BASE_URL' as MsgKey;
export const MESSAGE_FOLDER_PATH = 'MESSAGE_FOLDER_PATH' as MsgKey;
export const MESSAGE_UPDATE_WEBVIEW = 'MESSAGE_UPDATE_WEBVIEW' as MsgKey;
export const MESSAGE_OPEN_FOLDER = 'MESSAGE_OPEN_FOLDER' as MsgKey;
export const MESSAGE_SET_ENTRY_FILE = 'MESSAGE_SET_ENTRY_FILE' as MsgKey;
export const MESSAGE_GET_LANGUAGE = 'MESSAGE_GET_LANGUAGE' as MsgKey
