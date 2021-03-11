import * as fs from "fs";
import {
  getCurrentFolderPath,
  isPathExists
} from "../utils";
import * as stringRandom from "string-random";

const createDir = function (): void {
  const dirPath = getCurrentFolderPath();
  fs.mkdirSync(dirPath + "/.framegraph");
};
export const exportSvg = function (value: any): string | undefined {
  try {
    const dirPath = getCurrentFolderPath();
    if (!isPathExists(dirPath + "/.framegraph")) createDir();
    const fileName = `framegraph.${stringRandom(8)}.svg`
    fs.writeFileSync(dirPath + '/.framegraph/' + fileName as string, value);
    return '/.framegraph/' + fileName
  }
  catch (e) {
    return undefined;
  }
}
export const exportPng = function (value: any) {
  try {
    const dirPath = getCurrentFolderPath();
    if (!isPathExists(dirPath + "/.framegraph")) createDir();
    let Data = value.replace(/^data:image\/\w+;base64,/, "");
    const fileName = `framegraph.${stringRandom(8)}.png`
    const dataBuffer = Buffer.from(Data, 'base64');
    fs.writeFileSync(dirPath + '/.framegraph/' + fileName as string, dataBuffer);
    return '/.framegraph/' + fileName
  }
  catch (e) {
    return undefined;
  }
}
