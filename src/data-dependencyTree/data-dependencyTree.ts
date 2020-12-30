import * as path from "path";
import { DependencyTreeData } from "./dependencyTreeData";

import {
  statusMsgGetFolderPath,
  statusMsgGetPackageJsonPath,
  statusMsgGetEntryFile,
  statusMsgGetDependencyData,
  statusMsgGetDependencyProcessData,
  postEntryPath,
} from "../utils/message/messages";

import { getPackageJsonPath, getMainFilePath } from "./dependencyTreeMethods";
import { getCurrentFolderPath } from "../utils/utils";

import { getDependencyTree } from "../dependencyTree/index";

import { getEntryFileRelativePath } from "../utils/setting";
import { onError } from "../utils/error/onError";
import {
  NO_DEPENDENCY,
  NO_FOLDER,
  NO_PACKAGE_JSON,
  NO_MAIN_FILE,
  GET_DEPENDENCY_TREE_FAIL,
} from "../utils/error/errorKey";

import { pathExists } from "../utils/utils";

import {
  onGotFileString,
  onGotAST,
  onGotCircularStructureNode,
} from "../fileAnalysis/fileAnalysis";

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
  if (!mainFilePath) {
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
  postEntryPath(mainFilePath);
  const { dependencyTree: dp } = getDependencyTree(
    path.join(folderPath, mainFilePath),
    folderPath,
    {
      onGotFileString,
      onGotAST,
      onGotCircularStructureNode,
    }
  );
  console.log(dp);

  if (!dp) {
    onError(NO_DEPENDENCY);
    postMessage ? statusMsgGetDependencyProcessData.postError() : null;
  }
  postMessage ? statusMsgGetDependencyProcessData.postSuccess() : null;

  return dp as DependencyTreeData;
};
