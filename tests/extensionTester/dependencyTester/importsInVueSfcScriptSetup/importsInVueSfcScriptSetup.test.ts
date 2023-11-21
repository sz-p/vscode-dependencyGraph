import {
  getDependencyTreeDataFromFile,
  getDependencyTreeDataByCompute,
  getWebViewDataByCompute,
  getSavedDataFromFile,
  getSavedDataByCompute,
  getWebViewDataFromFile,
  setDataToFile
} from "../utils";
import { expect } from 'chai';
const mainFilePath = "./src/index.js";
const {
  dependencyTreeData,
  dependencyNodesData,
  folderPath,
} = getDependencyTreeDataFromFile("importsInVueSfcScriptSetup");
// const folderPath = path.join(__dirname, `./files`)
const { dependencyTree, dependencyNodes } = getDependencyTreeDataByCompute(
  folderPath,
  mainFilePath
);
const savedDataFromFile = getSavedDataFromFile("importsInVueSfcScriptSetup");
const savedDataByCompute = getSavedDataByCompute(
  "importsInVueSfcScriptSetup",
  folderPath,
  mainFilePath
);
const readData = getWebViewDataByCompute("importsInVueSfcScriptSetup", folderPath);
const webViewData = getWebViewDataFromFile("importsInVueSfcScriptSetup");
describe("dependencyTree(imports in vue sfc script setup): get dependencyTree data", function () {
  it("dependencyNodesData", function () {
    expect(dependencyNodesData.length).to.equal(dependencyNodes.length);
  });
  it("dependencyTreeData", function () {
    expect(dependencyTreeData.length).to.equal(dependencyTree.length);
  });
});

describe("dependencyTree(imports in vue sfc script setup): get saved data", function () {
  it("jsonString", function () {
    expect(savedDataFromFile.length).to.equal(savedDataByCompute.length);
  });
});

describe("dependencyTree(imports in vue sfc script setup): get webView data", function () {
  it("dependencyTreeData", function () {
    expect(readData.length).to.equal(webViewData.length);
  });
});
