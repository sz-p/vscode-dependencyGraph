import { getDependencyTreeDataFromFile, getDependencyTreeDataByCompute, getWebViewDataByCompute, getSavedDataFromFile, getSavedDataByCompute, getWebViewDataFromFile } from "../utils";
import { expect } from 'chai';
const mainFilePath = "./src/index.js";
const { dependencyTreeData, dependencyNodesData, folderPath } = getDependencyTreeDataFromFile("realProject")
const { dependencyTree, dependencyNodes } = getDependencyTreeDataByCompute(folderPath, mainFilePath);
const savedDataFromFile = getSavedDataFromFile("realProject")
const savedDataByCompute = getSavedDataByCompute("realProject", folderPath, mainFilePath);
const readData = getWebViewDataByCompute("realProject", folderPath);
const webViewData = getWebViewDataFromFile("realProject");

describe("dependencyTree(real project): get dependencyTree data", function () {
  it("dependencyNodesData", function () {
    expect(dependencyNodesData).to.equal(dependencyNodes);
  });
  it("dependencyTreeData", function () {
    expect(dependencyTreeData).to.equal(dependencyTree);
  });
});

describe("dependencyTree(real project): get saved data", function () {
  it("jsonString", function () {
    expect(savedDataFromFile).to.equal(savedDataByCompute);
  });
});

describe("dependencyTree(real project): get webView data", function () {
  it("dependencyTreeData", function () {
    expect(readData).to.equal(webViewData);
  });
});
