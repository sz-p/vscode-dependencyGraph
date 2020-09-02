import { showMessage } from '../utils/showMessage';
import { NO_FOLDER, NO_PACKAGE_JSON, NO_MAIN_FILE } from '../i18n/types';
import { getText } from '../i18n/i18n';
import { postMessage } from '../utils/postMessageToWebView';
import { MESSAGE_GET_DATA_STATUS, MESSAGE_DEPENDENCY_TREE_DATA } from '../utils/messagesKeys';
import {
	getCurrentFolderPath,
	getPackageJsonPath,
	getMainFilePath,
	getDependencyTree,
	processTreeData
} from './dependencyTreeMethods';

const getDependencyTreeData = () => {
	const folderPath = getCurrentFolderPath();
	if (!folderPath) {
		showMessage(getText(NO_FOLDER));
		return undefined;
	}
	postMessage({ key: MESSAGE_GET_DATA_STATUS, value: 1, description: 'get folder' });
	const packageJsonPath = getPackageJsonPath(folderPath);
	if (!packageJsonPath) {
		showMessage(getText(NO_PACKAGE_JSON));
		return undefined;
	}
	postMessage({ key: MESSAGE_GET_DATA_STATUS, value: 3, description: 'get packageJson' });
	const mainFilePath = getMainFilePath(packageJsonPath, folderPath);
	if (!mainFilePath) {
		showMessage(getText(NO_MAIN_FILE));
		return undefined;
	}
	postMessage({ key: MESSAGE_GET_DATA_STATUS, value: 4, description: 'get mainFile' });
	const dependencyTree = getDependencyTree(mainFilePath, folderPath);
	if (!Object.keys(dependencyTree).length) {
		// TODO move to i18n
		showMessage('get dependency tree fail');
		return undefined;
	}
  const processedTreeData = processTreeData(dependencyTree, folderPath);
  postMessage({ key: MESSAGE_, value: 0, description: 'get dependencyTreeData' });
	postMessage({ key: MESSAGE_GET_DATA_STATUS, value: 0, description: 'get dependencyTreeData' });
	postMessage({ key: MESSAGE_DEPENDENCY_TREE_DATA, value: processedTreeData });
	return processedTreeData;
};
export { getDependencyTreeData };
