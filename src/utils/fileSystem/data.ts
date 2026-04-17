/**
 * @introduction Data module
 *
 * @description read or set data to local
 */
import * as fs from "fs";
import {
  isPathExists,
  getObjectFromJsonFile,
  beforeSetDataToLocal,
} from "../utils";
import { getCurrentFolderPath } from "../getCurrentFolderPath"
import { DependencyTreeData } from "../../data-dependencyTree/dependencyTreeData";
import { transportsDataToDependenciesTreeData } from "../../data-dependencyTree/processTreeData";
import { TransportsData } from "../../data-dependencyTree/dependencyTreeData";
import { writeSnapshot } from "./snapshot";

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
    transportsData: TransportsData;
  }
  | false {
  let dp = {} as DependencyTreeData;
  const data = getDataFromDataFile() as TransportsData;
  const dirPath = getCurrentFolderPath();
  if (!data || !dirPath) return false;
  try {
    dp = transportsDataToDependenciesTreeData(data, dirPath);
  } catch (e) {
    return false;
  }
  return {
    dependencyTreeData: dp,
    transportsData: data,
  };
};

export const setData = function (value: any): boolean {
  const dirPath = getCurrentFolderPath() as string;
  beforeSetDataToLocal(dirPath);
  let Data = value;
  try {
    fs.writeFileSync(getDataFilePath() as string, JSON.stringify(Data));
    writeSnapshot(Data);
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
