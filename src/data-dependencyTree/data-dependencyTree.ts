import * as md5 from "md5";
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
  setSetting,
} from "../utils/setting/setting";
import { getCurrentFolderPath } from "../utils/utils";
import { getDependencyTree } from "../dependencyTree/index";
import { getMainFilePath, getPackageJsonPath } from "./dependencyTreeMethods";
import { onError } from "../utils/error/onError";
import {
  onGotAST,
  onGotCircularStructureNode,
  onGotFileString,
} from "../fileAnalysis/fileAnalysis";
import { pathExists } from "../utils/utils";
import {
  postSetting,
  statusMsgGetDependencyData,
  statusMsgGetDependencyProcessData,
  statusMsgGetEntryFile,
  statusMsgGetFolderPath,
  statusMsgGetPackageJsonPath,
} from "../utils/message/messages";
import { setData } from "../utils/data/data";
import {
  SETTING_KEY_ALIAS,
  SETTING_KEY_ENTRY_FILE_PATH,
  SETTING_KEY_RESOLVE_EXTENSIONS,
} from "../utils/setting/settingKey";

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
  (dependencyNodes as unknown) as DependencyTreeData;
  for (let key in dependencyNodes) {
    let dependencyNode = dependencyNodes[key] as DependencyTreeData;
    dependencyNode["ID"] = md5(key);
  }
  let dependencyNodeStack = [dp];
  while (dependencyNodeStack.length) {
    let dependencyNode = dependencyNodeStack.pop() as DependencyTreeData;
    if (dependencyNode?.children.length) {
      dependencyNodeStack = dependencyNodeStack.concat(
        dependencyNode?.children
      );
    }
    if (dependencyNode) {
      dependencyNode["ID"] = dependencyNodes[dependencyNode.absolutePath].ID;
    }
    for (let i = 0; i < dependencyNode.ancestors.length; i++) {
      dependencyNode.ancestors[i] =
        dependencyNodes[dependencyNode.ancestors[i]].ID;
    }
  }
  setData(dp);
  if (!dp) {
    onError(NO_DEPENDENCY);
    postMessage ? statusMsgGetDependencyProcessData.postError() : null;
  }
  postMessage ? statusMsgGetDependencyProcessData.postSuccess() : null;

  return dp as DependencyTreeData;
};
