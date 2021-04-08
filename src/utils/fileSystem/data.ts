/**
 * @introduction Data module
 *
 * @description read or set data to local
 */
import * as fs from "fs";
import {
  getCurrentFolderPath,
  isPathExists,
  getObjectFromJsonFile,
  beforeSetDataToLocal,
} from "../utils";
import { DependencyTreeData } from "../../data-dependencyTree/dependencyTreeData";
import { transportsDataToDependenciesTreeData } from "../../data-dependencyTree/processTreeData";
import {
  DependencyTree,
  DependencyNodes,
} from "../../data-dependencyTree/dependencyTreeData";

const getDataFilePath = function (): string | false {
  const dirPath = getCurrentFolderPath();
  if (!dirPath) return false;
  return dirPath + "/.dependencygraph/data.json";
};

export const getDataFromDataFile = function (): any {
  const DataFilePath = getDataFilePath();
  if (!DataFilePath) return false;
  return getObjectFromJsonFile(DataFilePath);
};

export const getData = function ():
  | {
      dependencyTreeData: DependencyTreeData;
      transportsData: {
        dependencyTree: DependencyTree;
        dependencyNodes: DependencyNodes;
      };
    }
  | false {
  let dp = {} as DependencyTreeData;
  const data = getDataFromDataFile();
  const dirPath = getCurrentFolderPath();
  if (!data || !dirPath) return false;
  try {
    dp = transportsDataToDependenciesTreeData(
      data.dependencyTree,
      data.dependencyNodes,
      dirPath
    );
  } catch (e) {
    return false;
  }
  return {
    dependencyTreeData: dp,
    transportsData: {
      dependencyTree: data.dependencyTree,
      dependencyNodes: data.dependencyNodes,
    },
  };
};

export const setData = function (value: any): boolean {
  beforeSetDataToLocal();
  let Data = value;
  try {
    fs.writeFileSync(getDataFilePath() as string, JSON.stringify(Data));
    return true;
  } catch (err) {
    return false;
  }
};

export const isSavedData = function (dirPath?: string): boolean {
  if (!dirPath) dirPath = getCurrentFolderPath();
  const DataFilePath = dirPath + "/.dependencygraph/data.json";
  if (!isPathExists(DataFilePath)) return false;
  return true;
};
