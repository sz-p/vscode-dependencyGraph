/**
 * @introduction setting module
 *
 * @description get setting \n set setting
 */
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import {
  getCurrentFolderPath,
  pathExists,
  getObjectFromJsonFile,
} from "../utils";
import {
  SETTING_KEY_ENTRY_FILE_PATH,
  SETTING_KEY_ALIAS,
  SETTING_KEY_RESOLVE_EXTENSIONS,
} from "./settingKey";

const createDir = function (): void {
  const dirPath = getCurrentFolderPath();
  fs.mkdirSync(dirPath + "/.framegraph");
};

const getSettingFilePath = function (): string | false {
  const dirPath = getCurrentFolderPath();
  if (!dirPath) return false;
  return dirPath + "/.framegraph/setting.json";
};

export const getAllSettingFromSettingFile = function (): any {
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
  const dirPath = getCurrentFolderPath();
  if (!pathExists(dirPath + "/.framegraph")) createDir();
  let setting = getAllSettingFromSettingFile();
  if (!setting) {
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
  return getSetting(SETTING_KEY_ENTRY_FILE_PATH);
};
export const setEntryFileRelativePath = function (value: string) {
  return setSetting(SETTING_KEY_ENTRY_FILE_PATH, value);
};

export const getAliasKey = function (): {
  [key: string]: string;
} {
  const alias = getSetting(SETTING_KEY_ALIAS);
  const folderPath = getCurrentFolderPath() as string;
  for (let key in alias) {
    alias[key] = path.join(folderPath, alias[key]);
  }
  return alias;
};

export const setAliasKey = function (value: object) {
  return setSetting(SETTING_KEY_ALIAS, value);
};

export const getResolveExtension = function (): string[] | undefined {
  return getSetting(SETTING_KEY_RESOLVE_EXTENSIONS);
};

export const setResolveExtension = function (value: string[] | undefined) {
  return setSetting(SETTING_KEY_RESOLVE_EXTENSIONS, value);
};

export const getActiveTheme = function () {
  const kind = vscode.window.activeColorTheme.kind;
  return vscode.ColorThemeKind[kind];
};
