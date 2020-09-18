import { DependencyTreeData } from './dependencyTreeData';

import {
	statusMsgGetFolderPath,
	statusMsgGetPackageJsonPath,
	statusMsgGetEntryFile,
	statusMsgGetDependencyData,
	statusMsgGetDependencyProcessData
} from '../utils/message/messages';

import {
	getPackageJsonPath,
	getMainFilePath,
	getDependencyTree,
	processTreeData,
	getCurrentFolderPath
} from './dependencyTreeMethods';

import { getEntryFilePath } from '../utils/config';
import { onError } from '../utils/error/onError';
import {
	NO_DEPENDENCY,
	NO_FOLDER,
	NO_PACKAGE_JSON,
	NO_MAIN_FILE,
	GET_DEPENDENCY_TREE_FAIL
} from '../utils/error/errorKey';

export const getDependencyTreeData = (postMessage?: boolean): DependencyTreeData | undefined => {
	// find folder Path catch path sendStatus
	const folderPath = getCurrentFolderPath();
	if (!folderPath) {
		onError(NO_FOLDER);
		postMessage ? statusMsgGetFolderPath.postError() : null;
		return undefined;
	}
	postMessage ? statusMsgGetFolderPath.postSuccess() : null;

	// find cached path sendStatus
	let mainFilePath = getEntryFilePath();
	if (mainFilePath === undefined) {
		// find package.json and main file
		const packageJsonPath = getPackageJsonPath(folderPath);
		if (!packageJsonPath) {
			onError(NO_PACKAGE_JSON);
			postMessage ? statusMsgGetPackageJsonPath.postError() : null;
			return undefined;
		}
		postMessage ? statusMsgGetPackageJsonPath.postSuccess() : null;
		mainFilePath = getMainFilePath(folderPath, packageJsonPath);
		if (!mainFilePath) {
			onError(NO_MAIN_FILE);
			postMessage ? statusMsgGetEntryFile.postError() : null;
			return undefined;
		}
	}
	postMessage ? statusMsgGetEntryFile.postSuccess() : null;

	const dependencyTree = getDependencyTree(mainFilePath, folderPath);
	if (!Object.keys(dependencyTree).length) {
		onError(GET_DEPENDENCY_TREE_FAIL);
		postMessage ? statusMsgGetDependencyData.postError() : null;
		return undefined;
  }
	postMessage ? statusMsgGetDependencyData.postSuccess() : null;


  const processedTreeData = processTreeData(dependencyTree, folderPath);
	if (!processedTreeData) {
		onError(NO_DEPENDENCY);
		postMessage ? statusMsgGetDependencyProcessData.postError() : null;
	}
	postMessage ? statusMsgGetDependencyProcessData.postSuccess() : null;

  return processedTreeData;
};
