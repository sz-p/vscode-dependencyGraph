import * as types from '../types';
import * as errorKey from '../../utils/error/errorKey';
export const zhcn = {} as any;

zhcn[errorKey.NO_FOLDER] = '工作区内无文件夹';
zhcn[errorKey.NO_PACKAGE_JSON] = '未发现 PackageJson';
zhcn[errorKey.NO_MAIN_FILE] = '未发现 MainFile';
zhcn[errorKey.GET_DEPENDENCY_TREE_FAIL] = '获取文件依赖树失败';
zhcn[errorKey.NO_WEBVIEW_PANEL] = '无WebView页面';
zhcn[errorKey.NO_DEPENDENCY] = '无文件依赖';
zhcn[errorKey.NO_DEPENDENCY_TREE_DATA] = '无文件依赖数据';

zhcn[types.FOLDER] = '文件夹';
zhcn[types.OPEN_FOLDER] = '打开文件夹';
zhcn[types.ENTRY_FILE] = '入口文件';
zhcn[types.SET_ENTRY_FILE] = '设置入口文件';
