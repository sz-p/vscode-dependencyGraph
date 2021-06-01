/**
 * @introduction svg & png module
 *
 * @description save svg or png file to local
 */
import * as fs from "fs";
import { beforeSetDataToLocal } from "../utils";
import { getCurrentFolderPath } from "../getCurrentFolderPath"
import * as stringRandom from "string-random";

const getExportFilePath = function (fileName: string): string | false {
  const dirPath = getCurrentFolderPath();
  if (!dirPath) return false;
  return dirPath + "/.dependencygraph/" + fileName;
};

export const exportSvg = function (value: any): string | undefined {
  try {
    const dirPath = getCurrentFolderPath() as string;
    beforeSetDataToLocal(dirPath);
    const fileName = `dependencygraph.${stringRandom(8)}.svg`;
    const filePath = getExportFilePath(fileName);
    fs.writeFileSync(filePath as string, value);
    return "/.dependencygraph/" + fileName;
  } catch (e) {
    return undefined;
  }
};
export const exportPng = function (value: any) {
  try {
    const dirPath = getCurrentFolderPath() as string;
    beforeSetDataToLocal(dirPath);
    let Data = value.replace(/^data:image\/\w+;base64,/, "");
    const fileName = `dependencygraph.${stringRandom(8)}.png`;
    const dataBuffer = Buffer.from(Data, "base64");
    const filePath = getExportFilePath(fileName);
    fs.writeFileSync(filePath as string, dataBuffer);
    return "/.dependencygraph/" + fileName;
  } catch (e) {
    return undefined;
  }
};
