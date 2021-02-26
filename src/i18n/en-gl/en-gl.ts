import * as types from "../types";
import * as errorKey from "../../utils/error/errorKey";
import * as status from "../../data-dependencyTree/statusType";

export const engl = {} as any;

engl[errorKey.NO_FOLDER] = "No find folder in workspace";
engl[errorKey.NO_PACKAGE_JSON] = "No find package.json";
engl[errorKey.NO_MAIN_FILE] = "No find main file";
engl[errorKey.GET_DEPENDENCY_TREE_FAIL] = "Get file dependency tree fail";
engl[errorKey.NO_WEBVIEW_PANEL] = "No webview panel";
engl[errorKey.NO_DEPENDENCY] = "No file dependency";
engl[errorKey.NO_DEPENDENCY_TREE_DATA] = "No file dependency tree data";
engl[errorKey.GET_AST_FAILED] = "get AST syntax tree fail";

engl[types.WAITING_DATA] = "Waiting for data...";
engl[types.CONFIRM] = "Confirm";
engl[types.ADD] = "Insert";
engl[types.DELETE] = "Delete";
engl[types.WAITING] = "Waiting ";

engl[types.SUCCESS] = "Success";
engl[types.FAILED] = "Failed";

engl[types.SETTING] = "Setting";
engl[types.COMMAND] = "Command";
engl[types.SAVE] = "Save";
engl[types.SAVE_DATA] = "Save data";
engl[types.SAVE_DATA_TOOLTIP] =
  "After saving the data, the existing data will be read by default next time. To update the data, please click the update data button.  ";
engl[types.EXPORT] = "Export";
engl[types.UPDATE_DATA] = "Update data";
engl[types.START_UPDATE_DATA] = "Start update data";
engl[types.UPDATED_DATA] = "Data updated";
engl[types.UPDATE_DATA_TOOLTIP] =
  "Update data will save data when data not saved";
engl[types.EXPORT_SVG] = "Export SVG";
engl[types.EXPORT_PNG] = "Export PNG";
engl[types.EXPORT_TOOLTIP] = "Export";

engl[types.CIRCULAR_STRUCTURE_NODE_INTRODUCTION] = "Circular Structure";
engl[types.CIRCULAR_STRUCTURE_NODE_DESCRIPTION] =
  "Loop dependence \\n The previous node was existed in dependence chain";

engl[types.FRAME_GRAPH_WEBVIEW] = "Frame graph view page";
engl[types.FOLDER] = "Folder";
engl[types.OPEN_FOLDER] = "Open folder";
engl[types.ENTRY_FILE] = "Entry file";
engl[types.SET_ENTRY_FILE] = "Set entry file";
engl[types.RESOLVE_EXTENSIONS] = "Resolve extensions";
engl[types.RESOLVE_ALIAS] = "Resolve alias";
engl[types.NO_RESOLVE_ALIAS] = "No resolve path alias";
engl[types.RESOLVE_PATH] = "Resolve path";

engl[status.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER] = "Get opened folder";
engl[status.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON] =
  "Get packageJson file";
engl[status.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE] = "Get entry file";
engl[status.STATUS_GET_DEPENDENCY_DATA_GET_DATA] = "Get dependency data";
engl[status.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA] =
  "Process dependency data";

engl[types.FILE_LINES] = "File lineNumbers";
engl[types.FILE_TYPE] = "File type";
engl[types.INTRODUCTION] = "Introduction";
engl[types.DESCRIPTION] = "Description";
engl[types.METHODS] = "Methods";
engl[types.METHODS_ANALYZED_FAILED] = "Methods analyzed failed";
engl[types.NOT_SUPPORTED] = " is not supported for now";
