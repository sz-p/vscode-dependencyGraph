import {
  getDependencyTreeDataFromFile as getDependencyTreeDataFromFileBase,
  getDependencyTreeDataByCompute,
  getWebViewDataByCompute as getWebViewDataByComputeBase,
  getSavedDataFromFile as getSavedDataFromFileBase,
  getSavedDataByCompute,
  getWebViewDataFromFile as getWebViewDataFromFileBase,
  setDataToFile
} from "../utils";
const getWebViewDataByCompute = function (testCase: string, folderPath: string) {
  return getWebViewDataByComputeBase('py', testCase, folderPath);
}
const getSavedDataFromFile = function (testCase: string) {
  return getSavedDataFromFileBase('py', testCase);
}
const getWebViewDataFromFile = function (testCase: string) {
  return getWebViewDataFromFileBase('py', testCase);
}
const getDependencyTreeDataFromFile = function (testCase: string) {
  return getDependencyTreeDataFromFileBase('py', testCase)
}
export {
  getDependencyTreeDataFromFile,
  getDependencyTreeDataByCompute,
  getWebViewDataByCompute,
  getSavedDataFromFile,
  getSavedDataByCompute,
  getWebViewDataFromFile,
  setDataToFile
}
