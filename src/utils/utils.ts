/**
 * @introduction util functions
 */
import * as fs from "fs";
import * as JSON5 from "json5";
export const beforeSetDataToLocal = function (dirPath: string): void {
  if (!isPathExists(dirPath + "/.dependencygraph")) {
    createLocalFileDir(dirPath);
  }
};
/**
 * create local files dir
 */
export const createLocalFileDir = function (dirPath: string): void {
  fs.mkdirSync(dirPath + "/.dependencygraph");
};

export const isPathExists = function (p: string): boolean {
  try {
    fs.accessSync(p);
  } catch (err) {
    return false;
  }
  return true;
};

/**
 * readFile and JSON parse
 *
 * @param {string} filePath
 * @returns {*}
 */
export const getObjectFromJsonFile = function (
  filePath: string
):
  | {
    [key: string]: any;
  }
  | false {
  if (!isPathExists(filePath)) return false;
  try {
    const fileString = fs.readFileSync(filePath, "utf8")
    const jsonObj = JSON5.parse(fileString);
    return jsonObj
  } catch (e) {
    return false
  }
};

/**
 * only used on vscode.window.showInformationMessage
 *
 * @returns Promise<unknown>
 */
export const thenAbleWithTimeout = (
  prom: Promise<void>,
  time: number
): Promise<unknown> => {
  let timer: NodeJS.Timeout;
  return Promise.race([
    prom,
    new Promise((_r) => (timer = setTimeout(_r, time))),
  ]).finally(() => clearTimeout(timer));
};
