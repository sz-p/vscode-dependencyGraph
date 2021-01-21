import * as fs from "fs";
import {
  getCurrentFolderPath,
  pathExists,
  getObjectFromJsonFile,
} from "../utils";
import { DependencyTreeData } from "../../data-dependencyTree/dependencyTreeData.d";
import { transportsDataToDependenciesTreeData } from "../../data-dependencyTree/processTreeData";
import {
  DependencyTree,
  DependencyNodes,
} from "../../data-dependencyTree/dependencyTreeData.d";

const createDir = function (): void {
  const dirPath = getCurrentFolderPath();
  fs.mkdirSync(dirPath + "/.framegraph");
};

const getDataFilePath = function (): string | false {
  const dirPath = getCurrentFolderPath();
  if (!dirPath) return false;
  return dirPath + "/.framegraph/data.json";
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
  if (!data) return false;
  try {
    dp = transportsDataToDependenciesTreeData(data.tree, data.nodes);
  } catch (e) {
    return false;
  }
  return {
    dependencyTreeData: dp,
    transportsData: {
      dependencyTree: data.tree,
      dependencyNodes: data.nodes,
    },
  };
};

export const setData = function (value: any): boolean {
  const dirPath = getCurrentFolderPath();
  if (!pathExists(dirPath + "/.framegraph")) createDir();
  let Data = value;
  try {
    fs.writeFileSync(getDataFilePath() as string, JSON.stringify(Data));
    return true;
  } catch (err) {
    return false;
  }
};
