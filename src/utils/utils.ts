import * as fs from "fs";
import * as vscode from "vscode";

export const pathExists = function (p: string): boolean {
  try {
    fs.accessSync(p);
  } catch (err) {
    return false;
  }
  return true;
};

export const getObjectFromJsonFile = function (filePath: string): any {
  if (!pathExists(filePath)) return false;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

/**
 * get current workspace first folder path
 * catch path return path
 *
 * @returns {(String | undefined)}
 */
export const getCurrentFolderPath = function (): string | undefined {
  const ws = vscode.workspace;
  let folder = ws.workspaceFolders;
  let folderPath = "";
  if (folder !== undefined) {
    folderPath = folder[0].uri.fsPath;
  }
  if (folderPath) {
    // setCurrentFolderPath(folderPath);
    return folderPath;
  } else {
    return undefined;
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
