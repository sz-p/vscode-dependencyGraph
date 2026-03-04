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
import { DependencyTree, DependencyNodes, DependencyNode } from "./dependencyTreeData.d";
import { logger } from "../utils/logger"
import * as md5 from "md5";
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

const getChildNodeID = function (parentNodeID: string, fileID: string) {
  const md5Hash = md5(parentNodeID + fileID);
  return md5Hash;
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
  resolveExtensions: string[] | undefined,
  maxDepth: number = 2
):
  | {
    dp: DependencyTreeData;
    nodes: DependencyNodes;
    tree: DependencyTree;
  }
  | false {
  logger.debug("start getDependencyTree");
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
    logger.error("getDependencyTree error", e);
    // getDependencyTreeProfile.end()
    return false;
  }
  logger.debug("stop getDependencyTree");
  // getDependencyTreeProfile.end()
  try {
    const { dependencyTree: dp, dependencyNodes } = dependencyTreeData
    // console.log('dependenciesTreeDataToTransportsData')
    logger.debug("start dependenciesTreeDataToTransportsDataProfile");
    // dependenciesTreeDataToTransportsDataProfile.start()
    const {
      dependencyNodes: nodes,
      dependencyTree: tree,
    } = dependenciesTreeDataToTransportsData(
      dp as DependencyTreeData,
      dependencyNodes,
      folderPath,
      maxDepth
    );
    if (!dp) {
      logger.error("stop dependenciesTreeDataToTransportsDataProfile");
      // dependenciesTreeDataToTransportsDataProfile.end()
      return false;
    } else {
      logger.debug("stop dependenciesTreeDataToTransportsDataProfile");
      // dependenciesTreeDataToTransportsDataProfile.end()
      return { dp: dp as DependencyTreeData, nodes, tree };
    }
  } catch (e) {
    logger.error("error dependenciesTreeDataToTransportsDataProfile", e);
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
  statusCallBack?: StatusCallBack,
  maxDepth: number = 2
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
  const folderPath = checkFolderPath();
  logger.info("getDependencyTreeData");
  if (!folderPath) {
    statusCallBack ? await statusCallBack.checkFolderPathError() : null;
    return undefined;
  } else {
    statusCallBack ? await statusCallBack.checkFolderPathSuccess() : null;
  }
  const mainFilePath = checkMainFilePath(folderPath);
  logger.info("mainFilePath");
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
  logger.info("try checkDataFromFile");
  const dpDataFromFile = checkDataFromFile();
  if (!dpDataFromFile) {
  } else {
    if (!refresh) {
      statusCallBack ? await statusCallBack.checkGetDataFromFileSuccess() : null;
      logger.info("checkDataFromFile");
      return dpDataFromFile;
    }
  }
  logger.info("try checkDataFromAnalyser");
  statusCallBack ? await statusCallBack.startGetDependencyTreeDataSuccess() : null;
  // before getDependencyTree wait post all status
  statusCallBack ? await statusCallBack.allStatusPosted() : null;
  // checkDataFromAnalyser maybe be slow
  const dataFromAnalyser = checkDataFromAnalyser(
    folderPath,
    mainFilePath,
    alias,
    resolveExtensions,
    maxDepth
  );
  if (!dataFromAnalyser) {
    statusCallBack ? await statusCallBack.checkGetDataFromAnalyserError() : null;
  } else {
    const { dp, tree, nodes } = dataFromAnalyser;
    statusCallBack ? await statusCallBack.checkGetDataFromAnalyserSuccess() : null;
    logger.info("getDependencyTreeData success");
    return {
      dependencyTreeData: dp,
      transportsData: {
        dependencyTree: tree,
        dependencyNodes: nodes,
      },
    };
  }
};

/**
 * Expand a node to load its children asynchronously
 *
 * @param nodeId The node ID (fileID) to expand
 * @param maxDepth Depth to load for the subtree (default: 1, load immediate children only)
 * @returns Subtree data for the expanded node
 */
export const expandNode = async (
  nodeId: string,
  maxDepth: number = 1
): Promise<{
  dependencyTree: DependencyTree;
  dependencyNodes: DependencyNodes;
} | undefined> => {
  try {
    // Get current folder path
    const folderPath = getCurrentFolderPath();
    if (!folderPath) {
      logger.error("No folder path found for expandNode");
      return undefined;
    }

    // Get current dependency data from global state
    const transportsData = global.dependencyTreeData?.transportsData;
    if (!transportsData) {
      logger.error("No dependency tree data available for expandNode");
      return undefined;
    }

    const { dependencyTree: mainTree, dependencyNodes } = transportsData;

    // Find the node in the main tree by nodeId (which is nodeID, not fileID)
    const findNodeInTreeByNodeID = (tree: DependencyTree, targetNodeID: string): DependencyTree | null => {
      if (tree.nodeID === targetNodeID) {
        return tree;
      }
      if (tree.children) {
        for (const child of tree.children) {
          const found = findNodeInTreeByNodeID(child, targetNodeID);
          if (found) return found;
        }
      }
      return null;
    };

    const treeNode = findNodeInTreeByNodeID(mainTree, nodeId);
    if (!treeNode) {
      logger.error(`TreeNode not found in main tree for expandNode: ${nodeId}`);
      return undefined;
    }

    // Now get the node details from dependencyNodes using fileID
    const node = dependencyNodes[treeNode.fileID];
    if (!node) {
      logger.error(`Node not found in dependencyNodes for expandNode: ${treeNode.fileID}`);
      return undefined;
    }
    // nodeID is used to ensure correct parent-child relationships (commented for clarity)
    // const nodeID = treeNode.nodeID;

    // Get settings (alias and resolveExtensions)
    const alias = getAliasKey();
    const resolveExtensions = getResolveExtension() || defaultOptions.resolveExtensions;

    logger.info(`Expanding node: ${node.relativePath}, depth: ${maxDepth}`);

    // Build absolute path from relative path
    const absolutePath = path.join(folderPath, node.relativePath);

    // Parse subtree starting from this node
    const subtreeData = getDependencyTree(
      absolutePath,
      folderPath,
      {
        alias,
        resolveExtensions,
        maxDepth,
        onGotFileString,
        onGotAST,
        onGotCircularStructureNode,
      }
    );

    if (!subtreeData) {
      logger.error("Failed to get subtree data for expandNode");
      return undefined;
    }

    const { dependencyTree: rawTree, dependencyNodes: rawNodes } = subtreeData;

    // Convert the subtree data to transport format
    // Use the clicked node's parentNodeID to ensure correct nodeID generation
    // This ensures the root of the subtree gets the same nodeID as the clicked node
    const { dependencyTree, dependencyNodes: processedNodes } = dependenciesTreeDataToTransportsData(
      rawTree as DependencyTreeData,
      rawNodes,
      folderPath,
      maxDepth,
      treeNode.parentNodeID || null
    );

    // Clear the hasMoreChildren flag for the clicked node in the returned tree
    dependencyTree.hasMoreChildren = false;

    // Also clear hasMoreChildren for the clicked node in processedNodes if it exists
    if (processedNodes[node.fileID]) {
      processedNodes[node.fileID] = {
        ...processedNodes[node.fileID],
        hasMoreChildren: false
      };
    }

    // Return the subtree data
    return {
      dependencyTree,
      dependencyNodes: processedNodes
    };
  } catch (error) {
    logger.error("Error in expandNode:", error);
    return undefined;
  }
};
