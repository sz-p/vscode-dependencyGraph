import * as types from '../types';
import * as errorKey from '../../utils/error/errorKey';
import * as status from '../../data-dependencyTree/statusType';
export const zhcn = {} as any;

zhcn[errorKey.NO_FOLDER] = '工作区内无文件夹';
zhcn[errorKey.NO_PACKAGE_JSON] = '未发现 PackageJson';
zhcn[errorKey.NO_MAIN_FILE] = '未发现 MainFile';
zhcn[errorKey.GET_DEPENDENCY_TREE_FAIL] = '获取文件依赖树失败';
zhcn[errorKey.NO_WEBVIEW_PANEL] = '无WebView页面';
zhcn[errorKey.NO_DEPENDENCY] = '无文件依赖';
zhcn[errorKey.NO_DEPENDENCY_TREE_DATA] = '无文件依赖数据';
zhcn[errorKey.GET_AST_FAILED] = '获取AST语法树失败';

zhcn[types.SUCCESS] = '成功';
zhcn[types.FAILED] = '失败';

zhcn[types.FOLDER] = '文件夹';
zhcn[types.OPEN_FOLDER] = '打开文件夹';
zhcn[types.ENTRY_FILE] = '入口文件';
zhcn[types.SET_ENTRY_FILE] = '设置入口文件';
zhcn[types.FRAME_GRAPH_WEBVIEW] = '架构图插件视图页面';

zhcn[status.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER] = '获取已打开的文件夹';
zhcn[status.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON] = '获取PackageJson文件';
zhcn[status.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE] = '获取入口文件';
zhcn[status.STATUS_GET_DEPENDENCY_DATA_GET_DATA] = '获取依赖树';
zhcn[status.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA] = '处理依赖树数据';

zhcn[types.FILE_LINES] = '文件行数';
zhcn[types.FILE_TYPE] = '文件类型';
zhcn[types.INTRODUCTION] = '简介';
zhcn[types.DESCRIPTION] = '描述';
zhcn[types.METHODS] = '方法';
zhcn[types.METHODS_ANALYZED_FAILED] = '方法分析失败';
zhcn[types.NOT_SUPPORTED] = ' 文件暂不支持';
