import * as path from "path";
import { defaultOptions } from "../dependencyTree/core/defaultOptions";
import { DependencyTreeData } from "./dependencyTreeData";
import {
  GET_DEPENDENCY_TREE_FAIL,
  NO_DEPENDENCY,
  NO_FOLDER,
  NO_MAIN_FILE,
  NO_PACKAGE_JSON,
} from "../utils/error/errorKey";
import {
  getAllSettingFromSettingFile,
  setEntryFileRelativePath,
  setAliasKey,
  setResolveExtension,
  getAliasKey,
  getResolveExtension,
  getEntryFileRelativePath,
} from "../utils/setting/setting";
import { getCurrentFolderPath, pathExists } from "../utils/utils";
import { getDependencyTree } from "../dependencyTree/index";
import { getMainFilePath, getPackageJsonPath } from "./dependencyTreeMethods";
import { onError } from "../utils/error/onError";
import {
  onGotAST,
  onGotCircularStructureNode,
  onGotFileString,
} from "../fileAnalysis/fileAnalysis";
import {
  postSetting,
  statusMsgGetDependencyData,
  statusMsgGetDependencyProcessData,
  statusMsgGetEntryFile,
  statusMsgGetFolderPath,
  statusMsgGetPackageJsonPath,
  msgGetSavedData,
} from "../utils/message/messages";
import { setData, getData } from "../utils/data/data";

import { dependenciesTreeDataToTransportsData } from "./processTreeData";
import { DependencyTree, DependencyNodes } from "./dependencyTreeData.d";
export const getDependencyTreeData = async (
  postMessage?: boolean,
  refresh?: boolean
): Promise<
  | {
      dependencyTreeData: DependencyTreeData;
      transportsData: {
        dependencyTree: DependencyTree;
        dependencyNodes: DependencyNodes;
      };
    }
  | undefined
> => {
  // find folder Path catch path sendStatus
  const folderPath = getCurrentFolderPath();
  if (!folderPath || !pathExists(folderPath)) {
    onError(NO_FOLDER);
    postMessage ? await statusMsgGetFolderPath.postError() : null;
    return undefined;
  }
  postMessage ? await statusMsgGetFolderPath.postSuccess() : null;

  const setting = getAllSettingFromSettingFile();
  let mainFilePath = getEntryFileRelativePath();
  if (!mainFilePath) {
    // find package.json and main file
    const packageJsonPath = getPackageJsonPath(folderPath);
    if (!packageJsonPath) {
      onError(NO_PACKAGE_JSON);
      postMessage ? await statusMsgGetPackageJsonPath.postError() : null;
      return undefined;
    }
    postMessage ? await statusMsgGetPackageJsonPath.postSuccess() : null;
    mainFilePath = getMainFilePath(folderPath, packageJsonPath);
  }
  if (!mainFilePath || !pathExists(path.join(folderPath, mainFilePath))) {
    onError(NO_MAIN_FILE);
    postMessage ? await statusMsgGetEntryFile.postError() : null;
    return undefined;
  }
  setEntryFileRelativePath(mainFilePath);
  postMessage ? await statusMsgGetEntryFile.postSuccess() : null;
  let resolveExtensions = getResolveExtension();
  let alias = getAliasKey();
  if (!alias) {
    setAliasKey({});
  }
  if (!resolveExtensions) {
    resolveExtensions = defaultOptions.resolveExtensions;
    setResolveExtension(resolveExtensions);
  }
  postSetting(setting);
  let dpDataFromFile = getData();
  if (dpDataFromFile && !refresh) {
    msgGetSavedData.post();
    return dpDataFromFile;
  }
  const { dependencyTree: dp, dependencyNodes } = getDependencyTree(
    path.join(folderPath, mainFilePath),
    folderPath,
    {
      alias,
      resolveExtensions,
      onGotFileString,
      onGotAST,
      onGotCircularStructureNode,
    }
  );
  const {
    dependencyNodes: nodes,
    dependencyTree: tree,
  } = dependenciesTreeDataToTransportsData(
    dp as DependencyTreeData,
    dependencyNodes,
    folderPath
  );
  if (!dp) {
    onError(NO_DEPENDENCY);
    postMessage ? await statusMsgGetDependencyProcessData.postError() : null;
  }
  postMessage ? await statusMsgGetDependencyProcessData.postSuccess() : null;
  return {
    dependencyTreeData: dp as DependencyTreeData,
    transportsData: {
      dependencyTree: tree,
      dependencyNodes: nodes,
    },
  };
};
