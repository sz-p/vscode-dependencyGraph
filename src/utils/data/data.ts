import * as fs from "fs";
import {
  getCurrentFolderPath,
  pathExists,
  getObjectFromJsonFile,
} from "../utils";

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

export const setData = function (value: any): boolean {
  const dirPath = getCurrentFolderPath();
  if (!pathExists(dirPath + "/.framegraph")) createDir();
  let Data = value;
  try {
    fs.writeFileSync(
      getDataFilePath() as string,
      JSON.stringify(Data, null, 2)
    );
    return true;
  } catch (err) {
    return false;
  }
};
