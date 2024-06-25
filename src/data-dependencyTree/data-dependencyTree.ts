/**
 * @introduction get dependency tree data
 *
 * @description analyse file dependency by DependencyTreeData \n process data ready to send
 */
import * as path from "path";
import { getDependencyTree, defaultOptions } from "@packages/dependency-tree";
import { DependencyTreeData } from "./dependencyTreeData";
import { NO_ENTRY_FILE, NO_PACKAGE_JSON } from "../utils/error/errorKey";
import {
  getAllSettingFromSettingFile,
  setEntryFileRelativePath,
  setAliasKey,
  setResolveExtension,
  getAliasKey,
  getResolveExtension,
  getEntryFileRelativePath,
} from "../utils/fileSystem/setting/setting";
import { isPathExists } from "../utils/utils";
import { getCurrentFolderPath } from "../utils/getCurrentFolderPath"
import { getMainFilePath, getPackageJsonPath } from "./dependencyTreeMethods";
import {
  onGotAST,
  onGotCircularStructureNode,
  onGotFileString,
} from "../fileAnalysis/fileAnalysis";
import { setData, getData } from "../utils/fileSystem/data";
import { StatusCallBack } from "./getDataStatusCallBack";
import { dependenciesTreeDataToTransportsData } from "./processTreeData";
import { DependencyTree, DependencyNodes } from "./dependencyTreeData.d";
// import { Profile } from "../utils/profile"
// const getDependencyTreeProfile = new Profile('getDependencyTree');
// const dependenciesTreeDataToTransportsDataProfile = new Profile('dependenciesTreeDataToTransportsData');
/**
 * Check whether the folder was opened
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
    return NO_ENTRY_FILE;
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
/**
 * check data from getDependencyTree
 *
 * @param {boolean} [refresh]
 * @returns
 */
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
  // getDependencyTreeProfile.start()
  let dependencyTreeData = undefined;
  try {
    dependencyTreeData = getDependencyTree(
      path.join(folderPath, mainFilePath),
      folderPath,
      {
        alias,
        resolveExtensions,
        onGotFileString,
        onGotAST,
        onGotCircularStructureNode,
      });
  } catch (e) {
    // getDependencyTreeProfile.end()
    return false;
  }
  // getDependencyTreeProfile.end()
  try {
    const { dependencyTree: dp, dependencyNodes } = dependencyTreeData
    // console.log('dependenciesTreeDataToTransportsData')
    // dependenciesTreeDataToTransportsDataProfile.start()
    const {
      dependencyNodes: nodes,
      dependencyTree: tree,
    } = dependenciesTreeDataToTransportsData(
      dp as DependencyTreeData,
      dependencyNodes,
      folderPath
    );
    if (!dp) {
      // dependenciesTreeDataToTransportsDataProfile.end()
      return false;
    } else {
      // dependenciesTreeDataToTransportsDataProfile.end()
      return { dp: dp as DependencyTreeData, nodes, tree };
    }
  } catch (e) {
    // dependenciesTreeDataToTransportsDataProfile.end()
    return false;
  }

};
/**
 * getDependencyTreeData
 *
 * @param {boolean} [refresh]
 * @param {StatusCallBack} [statusCallBack]
 * @returns {(Promise<
 *   | {
 *       dependencyTreeData: DependencyTreeData;
 *       transportsData: {
 *         dependencyTree: DependencyTree;
 *         dependencyNodes: DependencyNodes;
 *       };
 *     }
 *   | undefined
 * >)}
 */
export const getDependencyTreeData = async (
  refresh?: boolean,
  statusCallBack?: StatusCallBack
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
  const setting = getAllSettingFromSettingFile();
  const folderPath = checkFolderPath();
  if (!folderPath) {
    statusCallBack ? await statusCallBack.checkFolderPathError() : null;
    return undefined;
  } else {
    statusCallBack ? await statusCallBack.checkFolderPathSuccess() : null;
  }
  const mainFilePath = checkMainFilePath(folderPath);
  if (mainFilePath === NO_PACKAGE_JSON) {
    statusCallBack ? await statusCallBack.checkPackageJsonError() : null;
    return undefined;
  } else if (mainFilePath === NO_ENTRY_FILE) {
    statusCallBack ? await statusCallBack.checkPackageJsonSuccess() : null;
    statusCallBack ? await statusCallBack.checkMainFileError() : null;
  } else {
    statusCallBack ? await statusCallBack.checkPackageJsonSuccess() : null;
    statusCallBack ? await statusCallBack.checkMainFileSuccess() : null;
  }
  let resolveExtensions = getResolveExtension();
  let alias = getAliasKey();
  if (!resolveExtensions) {
    resolveExtensions = defaultOptions.resolveExtensions;
    setResolveExtension(resolveExtensions);
  }
  const dpDataFromFile = checkDataFromFile();
  if (!dpDataFromFile) {
  } else {
    if (!refresh) {
      statusCallBack ? await statusCallBack.checkGetDataFromFileSuccess() : null;
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
    statusCallBack ? await statusCallBack.checkGetDataFromAnalyserError() : null;
  } else {
    const { dp, tree, nodes } = dataFromAnalyser;
    // console.log(`开始向前端传输数据`)
    statusCallBack ? await statusCallBack.checkGetDataFromAnalyserSuccess() : null;
    return {
      dependencyTreeData: dp,
      transportsData: {
        dependencyTree: tree,
        dependencyNodes: nodes,
      },
    };
  }
};
