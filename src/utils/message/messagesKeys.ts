/**
 * @introduction MsgKey
 *
 * @description the message key between webview and extension
 */
type Opaque<Type, Token = unknown> = Type & { readonly __TYPE__: Token };
export type MsgKey = Opaque<string, "MsgKey">;
export const MESSAGE_GET_DATA_STATUS = "MESSAGE_GET_DATA_STATUS" as MsgKey;
export const MESSAGE_DEPENDENCY_TREE_DATA = "MESSAGE_DEPENDENCY_TREE_DATA" as MsgKey;
export const MESSAGE_FOCUS_ON_NODE = "MESSAGE_FOCUS_ON_NODE" as MsgKey;
export const MESSAGE_ASSETS_BASE_URL = "MESSAGE_ASSETS_BASE_URL" as MsgKey;
export const MESSAGE_FOLDER_PATH = "MESSAGE_FOLDER_PATH" as MsgKey;
export const MESSAGE_UPDATE_WEBVIEW = "MESSAGE_UPDATE_WEBVIEW" as MsgKey;
export const MESSAGE_OPEN_FOLDER = "MESSAGE_OPEN_FOLDER" as MsgKey;
export const MESSAGE_GET_ENTRY_FILE = "MESSAGE_GET_ENTRY_FILE" as MsgKey;
export const MESSAGE_SET_SETTING = "MESSAGE_SET_SETTING" as MsgKey;
export const MESSAGE_GET_LANGUAGE = "MESSAGE_GET_LANGUAGE" as MsgKey;
export const MESSAGE_GET_ACTIVE_THEME_KIND = "MESSAGE_GET_ACTIVE_THEME_KIND" as MsgKey;
export const MESSAGE_OPEN_FILE_FROM_WEBVIEW = "MESSAGE_OPEN_FILE_FROM_WEBVIEW" as MsgKey;
export const MESSAGE_IS_SAVED_DATA = "MESSAGE_IS_SAVED_DATA" as MsgKey;
export const MESSAGE_SAVE_DATA = "MESSAGE_SAVE_DATA" as MsgKey;
export const MESSAGE_UPDATE_DATA = "MESSAGE_UPDATE_DATA" as MsgKey;
export const MESSAGE_EXPORT_SVG = "MESSAGE_EXPORT_SVG" as MsgKey;
export const MESSAGE_EXPORT_PNG = "MESSAGE_EXPORT_PNG" as MsgKey;
export const MESSAGE_RUN_COMMAND_STATUS = "MESSAGE_RUN_COMMAND_STATUS" as MsgKey;
export const MESSAGE_WEBVIEW_LOG = "MESSAGE_WEBVIEW_LOG" as MsgKey;
export const MESSAGE_WEBVIEW_READY = "MESSAGE_WEBVIEW_READY" as MsgKey;
