import {
  getDependencyTreeDataFromFile,
  getDependencyTreeDataByCompute,
  getWebViewDataByCompute,
  getSavedDataFromFile,
  getSavedDataByCompute,
  getWebViewDataFromFile,
} from "../utils";
import { assert, expect } from '../../../chai';
const mainFilePath = "./src/index.js";
const {
  dependencyTreeData,
  dependencyNodesData,
  folderPath,
} = getDependencyTreeDataFromFile("realProject");
const { dependencyTree, dependencyNodes } = getDependencyTreeDataByCompute(
  folderPath,
  mainFilePath
);
const savedDataFromFile = getSavedDataFromFile("realProject");
const savedDataByCompute = getSavedDataByCompute(
  "realProject",
  folderPath,
  mainFilePath
);
const readData = getWebViewDataByCompute("realProject", folderPath);
const webViewData = getWebViewDataFromFile("realProject");
describe("dependencyTree(real project): get dependencyTree data", function () {
  it("dependencyNodesData", function () {
    // assert.equal(dependencyNodesData, dependencyNodes, "dependencyNodesData error")
    expect(dependencyNodesData, "dependencyNodesData error").to.equal(dependencyNodes, "dependencyNodesData error");
  });
  it("dependencyTreeData", function () {
    // expect(dependencyTreeData, "dependencyNodesData error").to.equal(dependencyTree, "dependencyTreeData error");
  });
});

describe("dependencyTree(real project): get saved data", function () {
  it("jsonString", function () {
    // expect(savedDataFromFile, "dependencyNodesData error").to.equal(savedDataByCompute, "savedDataFromFile error");
  });
});

describe("dependencyTree(real project): get webView data", function () {
  it("dependencyTreeData", function () {
    // expect(readData, "dependencyNodesData error").to.equal(webViewData, "readData error");
  });
});
