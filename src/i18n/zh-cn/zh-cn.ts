import * as types from "../types";
import * as errorKey from "../../utils/error/errorKey";
import * as status from "../../data-dependencyTree/statusType";
export const zhcn = {} as any;

zhcn[errorKey.NO_FOLDER] = "工作区内无文件夹";
zhcn[errorKey.NO_PACKAGE_JSON] = "未发现 PackageJson";
zhcn[errorKey.NO_ENTRY_FILE] = "未发现 MainFile";
zhcn[errorKey.GET_DEPENDENCY_TREE_FAIL] = "获取文件依赖树失败";
zhcn[errorKey.NO_WEBVIEW_PANEL] = "无WebView页面";
zhcn[errorKey.NO_DEPENDENCY] = "无文件依赖";
zhcn[errorKey.NO_DEPENDENCY_TREE_DATA] = "无文件依赖数据";
zhcn[errorKey.GET_AST_FAILED] = "获取AST语法树失败";

zhcn[types.WAITING_DATA] = "正在等待数据...";
zhcn[types.CONFIRM] = "确认";
zhcn[types.ADD] = "添加";
zhcn[types.DELETE] = "删除";
zhcn[types.WAITING] = "等待";

zhcn[types.SUCCESS] = "成功";
zhcn[types.FAILED] = "失败";

zhcn[types.SETTING] = "设置";
zhcn[types.COMMAND] = "命令";
zhcn[types.SAVE] = "保存";

zhcn[types.SAVE_DATA] = "保存数据";
zhcn[types.SAVE_DATA_TOOLTIP] =
  "保存数据后下次将会默认读取已有数据，要更新数据请点击更新数据按钮。";
zhcn[types.EXPORT] = "导出";
zhcn[types.UPDATE_DATA] = "更新数据";
zhcn[types.START_UPDATE_DATA] = "更新数据";
zhcn[types.UPDATED_DATA] = "数据更新完毕";
zhcn[types.UPDATE_DATA_FAILED] = "更新数据失败";
zhcn[types.UPDATE_DATA_TOOLTIP] = "未保存数据时、更新数据会保存数据。";
zhcn[types.EXPORT_SVG] = "导出SVG";
zhcn[types.EXPORT_PNG] = "导出PNG";
zhcn[types.EXPORT_TOOLTIP] = "导出";

zhcn[types.CIRCULAR_STRUCTURE_NODE_INTRODUCTION] = "环形结构";
zhcn[types.CIRCULAR_STRUCTURE_NODE_DESCRIPTION] =
  "循环依赖 \\n 在引用链上存在上一个节点";

zhcn[types.FRAME_GRAPH_WEBVIEW] = "依赖树图";
zhcn[types.FOLDER] = "文件夹";
zhcn[types.OPEN_FOLDER] = "打开文件夹";
zhcn[types.ENTRY_FILE] = "入口文件";
zhcn[types.SET_ENTRY_FILE] = "设置入口文件";
zhcn[types.RESOLVE_EXTENSIONS] = "被解析文件的后缀名";
zhcn[types.RESOLVE_ALIAS] = "路径别名";
zhcn[types.NO_RESOLVE_ALIAS] = "无路径别名";
zhcn[types.RESOLVE_PATH] = "被解析文件的路径";

zhcn[status.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER] = "获取已打开的文件夹";
zhcn[status.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON] =
  "获取PackageJson文件";
zhcn[status.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE] = "获取入口文件";
zhcn[status.STATUS_START_GET_DEPENDENCY_DATA] = "开始获计算赖树数据";
zhcn[status.STATUS_START_POST_DEPENDENCY_DATA] = "开始传输依赖树数据";
zhcn[status.STATUS_GET_DEPENDENCY_DATA_GET_DATA] = "获取依赖树";
zhcn[status.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA] = "处理依赖树数据";
zhcn[status.STATUS_DECODE_DEPENDENCY_DATA] = "解析依赖树数据";

zhcn[types.FILE_LINES] = "文件行数";
zhcn[types.FILE_TYPE] = "文件类型";
zhcn[types.FILE_PATH] = "文件路径";
zhcn[types.INTRODUCTION] = "简介";
zhcn[types.DESCRIPTION] = "描述";
zhcn[types.METHODS] = "方法";
zhcn[types.METHODS_ANALYZED_FAILED] = "方法分析失败";
zhcn[types.NOT_SUPPORTED] = " 文件暂不支持";
