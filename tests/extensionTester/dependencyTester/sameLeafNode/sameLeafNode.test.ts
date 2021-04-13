import {
  getDependencyTreeDataFromFile,
  getDependencyTreeDataByCompute,
  getWebViewDataByCompute,
  getSavedDataFromFile,
  getSavedDataByCompute,
  getWebViewDataFromFile,
} from "../utils";
import { expect } from '../../../chai';
const mainFilePath = "./src/index.js";
const {
  dependencyTreeData,
  dependencyNodesData,
  folderPath,
} = getDependencyTreeDataFromFile("sameLeafNode");
const { dependencyTree, dependencyNodes } = getDependencyTreeDataByCompute(
  folderPath,
  mainFilePath
);
const savedDataFromFile = getSavedDataFromFile("sameLeafNode");
const savedDataByCompute = getSavedDataByCompute(
  "sameLeafNode",
  folderPath,
  mainFilePath
);
const readData = getWebViewDataByCompute("sameLeafNode", folderPath);
const webViewData = getWebViewDataFromFile("sameLeafNode");

describe("dependencyTree(same leaf node): get dependencyTree data", function () {
  it("dependencyNodesData", function () {
    expect(dependencyNodesData).to.equal(dependencyNodes);
  });
  it("dependencyTreeData", function () {
    expect(dependencyTreeData).to.equal(dependencyTree);
  });
});

describe("dependencyTree(same leaf node): get saved data", function () {
  it("jsonString", function () {
    expect(savedDataFromFile).to.equal(savedDataByCompute);
  });
});

describe("dependencyTree(same leaf node): get webView data", function () {
  it("dependencyTreeData", function () {
    expect(readData).to.equal(webViewData);
  });
});
