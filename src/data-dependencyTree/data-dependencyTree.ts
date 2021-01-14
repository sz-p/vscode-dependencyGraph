import * as path from "path";
import { DependencyTreeData } from "./dependencyTreeData";

import {
  statusMsgGetFolderPath,
  statusMsgGetPackageJsonPath,
  statusMsgGetEntryFile,
  statusMsgGetDependencyData,
  statusMsgGetDependencyProcessData,
  postSetting,
} from "../utils/message/messages";

import { getPackageJsonPath, getMainFilePath } from "./dependencyTreeMethods";
import { getCurrentFolderPath } from "../utils/utils";

import { getDependencyTree } from "../dependencyTree/index";
import { defaultOptions } from "../dependencyTree/core/defaultOptions";
import {
  getAllSettingFromSettingFile,
  setSetting,
} from "../utils/setting/setting";
// import { setData } from "../utils/data/data";
import {
  SETTING_KEY_ENTRY_FILE_PATH,
  SETTING_KEY_RESOLVE_EXTENSIONS,
  SETTING_KEY_ALIAS,
} from "../utils/setting/settingKey";
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

  const setting = getAllSettingFromSettingFile();
  let mainFilePath = setting[SETTING_KEY_ENTRY_FILE_PATH];
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

  let resolveExtensions = setting[SETTING_KEY_RESOLVE_EXTENSIONS];
  let alias = setting[SETTING_KEY_ALIAS];
  for (let key in alias) {
    alias[key] = path.join(folderPath, alias[key]);
  }
  if (!resolveExtensions) {
    resolveExtensions = defaultOptions.resolveExtensions;
    setSetting(SETTING_KEY_RESOLVE_EXTENSIONS, resolveExtensions);
  }
  postSetting(setting);
  const { dependencyTree: dp } = getDependencyTree(
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
  // setData(dp);
  if (!dp) {
    onError(NO_DEPENDENCY);
    postMessage ? statusMsgGetDependencyProcessData.postError() : null;
  }
  postMessage ? statusMsgGetDependencyProcessData.postSuccess() : null;

  return dp as DependencyTreeData;
};
