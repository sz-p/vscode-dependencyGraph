import {
  getDependencyTreeDataFromFile,
  getDependencyTreeDataByCompute,
  getWebViewDataByCompute as getWebViewDataByComputeBase,
  getSavedDataFromFile as getSavedDataFromFileBase,
  getSavedDataByCompute,
  getWebViewDataFromFile as getWebViewDataFromFileBase,
  setDataToFile
} from "../utils";
const getWebViewDataByCompute = function (testCase: string, folderPath: string) {
  return getWebViewDataByComputeBase('js-ts', testCase, folderPath);
}
const getSavedDataFromFile = function (testCase: string) {
  return getSavedDataFromFileBase('js-ts', testCase);
}
const getWebViewDataFromFile = function (testCase: string) {
  return getWebViewDataFromFileBase('js-ts', testCase);
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
