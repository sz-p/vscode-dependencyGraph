import * as path from "path";
import { DependencyTreeData } from "./dependencyTreeData";
import * as dependencyTree from "dependency-tree";
import { analysesFile } from "../fileAnalysis/javascript/javascriptAnalysis";

import {
  statusMsgGetFolderPath,
  statusMsgGetPackageJsonPath,
  statusMsgGetEntryFile,
  statusMsgGetDependencyData,
  statusMsgGetDependencyProcessData,
} from "../utils/message/messages";

import {
  getPackageJsonPath,
  getMainFilePath,
  // getDependencyTree,
  processTreeData,
  getCurrentFolderPath,
} from "./dependencyTreeMethods";

import { getDependencyTree } from "../dependencyTree/index";

import { getEntryFileRelativePath } from "../utils/config";
import { onError } from "../utils/error/onError";
import {
  NO_DEPENDENCY,
  NO_FOLDER,
  NO_PACKAGE_JSON,
  NO_MAIN_FILE,
  GET_DEPENDENCY_TREE_FAIL,
} from "../utils/error/errorKey";

import { pathExists } from "../utils/utils";

export const getDependencyTreeData = (
  postMessage?: boolean
): DependencyTreeData | undefined => {
  // find folder Path catch path sendStatus
  const folderPath = getCurrentFolderPath();
  if (!folderPath || !pathExists(folderPath)) {
    onError(NO_FOLDER);
    postMessage ? statusMsgGetFolderPath.postError() : null;
    return undefined;
  }
  postMessage ? statusMsgGetFolderPath.postSuccess() : null;

  // find cached path sendStatus
  let mainFilePath = getEntryFileRelativePath();
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
  }
  if (!mainFilePath || !pathExists(path.join(folderPath, mainFilePath))) {
    onError(NO_MAIN_FILE);
    postMessage ? statusMsgGetEntryFile.postError() : null;
    return undefined;
  }
  postMessage ? statusMsgGetEntryFile.postSuccess() : null;

  console.log(getDependencyTree);
  const { dependencyTree: dp } = getDependencyTree(
    path.join(folderPath, mainFilePath),
    folderPath
  );
  console.log(dp);
  // const { dependencyTree: dp } = getDependencyTree(
  //   path.join(folderPath, mainFilePath),
  //   folderPath
  // );

  // console.log(dp);

  const { dependencyTree: processedTreeData, dependencyHash } = analysesFile(
    path.join(folderPath, mainFilePath),
    folderPath
  );
  // const dependencyTreeData = getDependencyTree(mainFilePath, folderPath);
  // if (!dependencyTreeData || !Object.keys(dependencyTreeData as dependencyTree.DependencyObj).length) {
  // 	onError(GET_DEPENDENCY_TREE_FAIL);
  // 	postMessage ? statusMsgGetDependencyData.postError() : null;
  // 	return undefined;
  // }
  // postMessage ? statusMsgGetDependencyData.postSuccess() : null;

  // const processedTreeData = processTreeData(dependencyTreeData as dependencyTree.DependencyObj, folderPath);
  if (!processedTreeData) {
    onError(NO_DEPENDENCY);
    postMessage ? statusMsgGetDependencyProcessData.postError() : null;
  }
  postMessage ? statusMsgGetDependencyProcessData.postSuccess() : null;

  return processedTreeData;
};
