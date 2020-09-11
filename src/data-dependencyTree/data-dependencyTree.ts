import { MsgKey } from '../utils/message/messagesKeys';
import { DependencyTreeData } from './dependencyTreeData';
import { postMessage, postMessageCatchError } from '../utils/message/postMessageToWebView';
import { MESSAGE_GET_DATA_STATUS } from '../utils/message/messagesKeys';
import {
	getCurrentFolderPath,
	getPackageJsonPath,
	getMainFilePath,
	getDependencyTree,
	processTreeData
} from './dependencyTreeMethods';

import { onError } from '../utils/error/onError';
import {
	NO_DEPENDENCY,
	NO_FOLDER,
	NO_PACKAGE_JSON,
	NO_MAIN_FILE,
	GET_DEPENDENCY_TREE_FAIL
} from '../utils/error/errorKey';

export const statusCallBack = function(key: MsgKey, value: any, description: string) {
	postMessage({ key, value, description });
};
export const statusCallBackCatchError = function(key: MsgKey, value: any, description: string) {
	postMessageCatchError({ key, value, description });
};
export const getDependencyTreeData = (statusCallBack?: Function): DependencyTreeData | undefined => {
	const folderPath = getCurrentFolderPath();
	if (!folderPath) {
		onError(NO_FOLDER);
		return undefined;
	}
	statusCallBack ? statusCallBack(MESSAGE_GET_DATA_STATUS, 1, 'get folder') : null;
	const packageJsonPath = getPackageJsonPath(folderPath);
	if (!packageJsonPath) {
		onError(NO_PACKAGE_JSON);
		return undefined;
	}
	statusCallBack ? statusCallBack(MESSAGE_GET_DATA_STATUS, 3, 'get packageJson') : null;
	const mainFilePath = getMainFilePath(packageJsonPath, folderPath);
	if (!mainFilePath) {
		onError(NO_MAIN_FILE);
		return undefined;
	}
	statusCallBack ? statusCallBack(MESSAGE_GET_DATA_STATUS, 4, 'get mainFile') : null;
	const dependencyTree = getDependencyTree(mainFilePath, folderPath);
	if (!Object.keys(dependencyTree).length) {
		onError(GET_DEPENDENCY_TREE_FAIL);
		return undefined;
	}
	const processedTreeData = processTreeData(dependencyTree, folderPath);
	if (!processedTreeData) {
		onError(NO_DEPENDENCY);
	}
	statusCallBack ? statusCallBack(MESSAGE_GET_DATA_STATUS, 0, 'get dependencyTreeData') : null;
	return processedTreeData;
};
