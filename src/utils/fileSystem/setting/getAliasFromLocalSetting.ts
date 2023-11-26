import * as path from "path";
import {
  getObjectFromJsonFile,
} from "../../utils";
const getAliasFromConfig = function (baseUrl: string, jsonPath?: string): object | false {
  const configPath = jsonPath ? jsonPath : './tsconfig.json';
  const fullPath = path.join(baseUrl, configPath);
  const configObj = getObjectFromJsonFile(fullPath);
  let alias = undefined;
  let baseUrlFromConfig = undefined;
  if (configObj && configObj['compilerOptions']['paths']) {
    alias = configObj['compilerOptions']['paths'];
  }
  if (configObj && configObj['compilerOptions']['baseUrl']) {
    baseUrlFromConfig = configObj['compilerOptions']['baseUrl'] || './';
  }
  if (alias) {
    // for (let key in alias) {
    //   // TODO change to array
    //   if (alias[key][0]) {
    //     alias[key] = path.join(baseUrlFromConfig, alias[key][0])
    //   }
    // }
    return alias
  }
  return false;
}
const getAliasFromTsConfig = function (baseUrl: string, tsJsonPath?: string): object | false {
  return getAliasFromConfig(baseUrl, tsJsonPath ? tsJsonPath : './tsconfig.json')
}
const getAliasFromJsConfig = function (baseUrl: string, jsJsonPath?: string): object | false {
  return getAliasFromConfig(baseUrl, jsJsonPath ? jsJsonPath : './tsconfig.json')
}

const getAliasFromWebPackConfig = function (): string | false {
  return false
  //todo
}

const getAliasFromVueConfig = function (): string | false {
  return false
  //todo
}

const ruleList = [getAliasFromTsConfig, getAliasFromJsConfig]


export const getAliasFromLocalSetting = function (baseURL: string): { [key: string]: string } | {} | false {
  for (let i = 0; i < ruleList.length; i++) {
    const alias = ruleList[i](baseURL);
    if (alias) {
      return alias
    }
  }
  return false
}
