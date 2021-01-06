import * as fs from "fs";
import {
  getCurrentFolderPath,
  pathExists,
  getObjectFromJsonFile,
} from "../utils";
import * as vscode from "vscode";


const createDir = function (): void {
  const dirPath = getCurrentFolderPath();
  fs.mkdirSync(dirPath + "/.framegraph");
};

const getSettingFilePath = function (): string | false {
  const dirPath = getCurrentFolderPath();
  if (!dirPath) return false;
  return dirPath + "/.framegraph/setting.json";
};

const getAllSettingFromSettingFile = function (): any {
  const settingFilePath = getSettingFilePath();
  if (!settingFilePath) return false;
  return getObjectFromJsonFile(settingFilePath);
};

const getSetting = function (settingKey: string): any {
  const setting = getAllSettingFromSettingFile();
  if (!setting) return false;
  return setting[settingKey];
};

export const setSetting = function (settingKey: string, value: any): boolean {
  let setting = getAllSettingFromSettingFile();
  if (!setting) {
    createDir();
    setting = {};
  }
  setting[settingKey] = value;
  try {
    fs.writeFileSync(
      getSettingFilePath() as string,
      JSON.stringify(setting, null, 2)
    );
    return true;
  } catch (err) {
    return false;
  }
};

export const getEntryFileRelativePath = function (): string | false {
  return getSetting("entryFilePath");
};
export const setEntryFileRelativePath = function (value: string) {
  return setSetting("entryFilePath", value);
};

export const getActiveTheme = function () {
  const kind = vscode.window.activeColorTheme.kind;
  return vscode.ColorThemeKind[kind];
};
