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
} from "../utils/fileSystem/setting";
import { getCurrentFolderPath, isPathExists } from "../utils/utils";
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
import { setData, getData } from "../utils/fileSystem/data";

import { dependenciesTreeDataToTransportsData } from "./processTreeData";
import { DependencyTree, DependencyNodes } from "./dependencyTreeData.d";

class statusCallBack {
  private readonly postMessage;
  constructor(postMessage: boolean | undefined) {
    if (postMessage === undefined) {
      this.postMessage = true;
    }
    this.postMessage = postMessage;
  }
  async checkFolderPathSuccess() {
    this.postMessage ? await statusMsgGetFolderPath.postSuccess() : null;
  }
  async checkFolderPathError() {
    onError(NO_FOLDER);
    this.postMessage ? await statusMsgGetFolderPath.postError() : null;
  }
  async checkPackageJsonError() {
    onError(NO_PACKAGE_JSON);
    this.postMessage ? await statusMsgGetPackageJsonPath.postError() : null;
  }
  async checkPackageJsonSuccess() {
    this.postMessage ? await statusMsgGetPackageJsonPath.postSuccess() : null;
  }
  async checkMainFileError() {
    onError(NO_MAIN_FILE);
    this.postMessage ? await statusMsgGetEntryFile.postError() : null;
  }
  async checkMainFileSuccess() {
    this.postMessage ? await statusMsgGetEntryFile.postSuccess() : null;
  }
  async checkGetDataFromFileError() {
    // onError(NO_MAIN_FILE);
    // this.postMessage ? await msgGetSavedData.post() : null;
  }
  async checkGetDataFromFileSuccess() {
    this.postMessage ? await msgGetSavedData.post() : null;
  }
  async checkGetDataFromAnalyserError() {
    onError(NO_DEPENDENCY);
    this.postMessage
      ? await statusMsgGetDependencyProcessData.postError()
      : null;
  }
  async checkGetDataFromAnalyserSuccess() {
    this.postMessage
      ? await statusMsgGetDependencyProcessData.postSuccess()
      : null;
  }
}
/**
 * Check whether the folder is open
 *
 * @returns {boolean}
 */
const checkFolderPath = function (): false | string {
  const folderPath = getCurrentFolderPath();
  if (!folderPath || !isPathExists(folderPath)) {
    return false;
  }
  return folderPath;
};

/**
 * Check whether entry file was existed
 *
 * @returns {boolean}
 */
const checkMainFilePath = function (folderPath: string): string {
  let mainFilePath = getEntryFileRelativePath();
  if (!mainFilePath) {
    const packageJsonPath = getPackageJsonPath(folderPath);
    if (!packageJsonPath) {
      return NO_PACKAGE_JSON;
    }
    mainFilePath = getMainFilePath(folderPath, packageJsonPath);
  }
  if (!mainFilePath || !isPathExists(path.join(folderPath, mainFilePath))) {
    return NO_MAIN_FILE;
  }
  setEntryFileRelativePath(mainFilePath);
  return mainFilePath;
};

/**
 * check data was saved
 *
 * @param {boolean} [refresh]
 * @returns
 */
const checkDataFromFile = function ():
  | {
      dependencyTreeData: DependencyTreeData;
      transportsData: {
        dependencyTree: DependencyTree;
        dependencyNodes: DependencyNodes;
      };
    }
  | false {
  let dpDataFromFile = getData();
  return dpDataFromFile || false;
};

const checkDataFromAnalyser = function (
  folderPath: string,
  mainFilePath: string,
  alias: {
    [key: string]: string;
  },
  resolveExtensions: string[] | undefined
):
  | {
      dp: DependencyTreeData;
      nodes: DependencyNodes;
      tree: DependencyTree;
    }
  | false {
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
    return false;
  } else {
    return { dp: dp as DependencyTreeData, nodes, tree };
  }
};

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
  const scb = new statusCallBack(postMessage);
  const setting = getAllSettingFromSettingFile();
  const folderPath = checkFolderPath();
  if (!folderPath) {
    scb.checkFolderPathError();
    return undefined;
  } else {
    scb.checkFolderPathSuccess();
  }
  const mainFilePath = checkMainFilePath(folderPath);
  if (mainFilePath === NO_PACKAGE_JSON) {
    scb.checkPackageJsonError();
    return undefined;
  } else if (mainFilePath === NO_MAIN_FILE) {
    scb.checkPackageJsonSuccess();
    scb.checkMainFileError();
  } else {
    scb.checkPackageJsonSuccess();
    scb.checkMainFileSuccess();
  }
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
  const dpDataFromFile = checkDataFromFile();
  if (!dpDataFromFile) {
  } else {
    if (!refresh) {
      scb.checkGetDataFromFileSuccess();
      return dpDataFromFile;
    }
  }
  const dataFromAnalyser = checkDataFromAnalyser(
    folderPath,
    mainFilePath,
    alias,
    resolveExtensions
  );
  if (!dataFromAnalyser) {
    scb.checkGetDataFromAnalyserError();
  } else {
    const { dp, tree, nodes } = dataFromAnalyser;
    scb.checkGetDataFromAnalyserSuccess();
    return {
      dependencyTreeData: dp,
      transportsData: {
        dependencyTree: tree,
        dependencyNodes: nodes,
      },
    };
  }
};
