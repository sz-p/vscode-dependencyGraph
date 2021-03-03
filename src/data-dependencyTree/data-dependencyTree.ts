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
  msgGetSavedData,
} from "../utils/message/messages";
import { setData, getData } from "../utils/data/data";
import {
  SETTING_KEY_ALIAS,
  SETTING_KEY_ENTRY_FILE_PATH,
  SETTING_KEY_RESOLVE_EXTENSIONS,
} from "../utils/setting/settingKey";

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
  let mainFilePath = undefined;
  if (setting && setting[SETTING_KEY_ENTRY_FILE_PATH]) {
    mainFilePath = JSON.parse(
      JSON.stringify(setting[SETTING_KEY_ENTRY_FILE_PATH])
    );
  }
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
  setSetting(SETTING_KEY_ENTRY_FILE_PATH, mainFilePath);
  postMessage ? await statusMsgGetEntryFile.postSuccess() : null;
  let resolveExtensions = undefined;
  let alias = undefined;
  if (setting && setting[SETTING_KEY_RESOLVE_EXTENSIONS]) {
    resolveExtensions = JSON.parse(
      JSON.stringify(setting[SETTING_KEY_RESOLVE_EXTENSIONS])
    );
  }
  if (setting && setting[SETTING_KEY_ALIAS]) {
    alias = JSON.parse(JSON.stringify(setting[SETTING_KEY_ALIAS]));
  } else {
    setSetting(SETTING_KEY_ALIAS, {});
  }
  for (let key in alias) {
    alias[key] = path.join(folderPath, alias[key]);
  }
  if (!resolveExtensions) {
    resolveExtensions = defaultOptions.resolveExtensions;
    setSetting(SETTING_KEY_RESOLVE_EXTENSIONS, resolveExtensions);
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
