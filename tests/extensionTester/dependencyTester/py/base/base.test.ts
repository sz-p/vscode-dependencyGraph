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

const mainFilePath = "./src/main.py";
const {
  dependencyTreeData,
  dependencyNodesData,
  folderPath,
} = getDependencyTreeDataFromFile("base");

const { dependencyTree, dependencyNodes } = getDependencyTreeDataByCompute(
  folderPath,
  mainFilePath
);

const savedDataFromFile = getSavedDataFromFile("base");
const savedDataByCompute = getSavedDataByCompute(
  "base",
  folderPath,
  mainFilePath
);

const readData = getWebViewDataByCompute("base", folderPath);
const webViewData = getWebViewDataFromFile("base");

describe("dependencyTree(Python import): get dependencyTree data", function () {
  it("dependencyNodesData", function () {
    expect(dependencyNodesData.length).to.equal(dependencyNodes.length);
  });
  it("dependencyTreeData", function () {
    expect(dependencyTreeData.length).to.equal(dependencyTree.length);
  });
});

describe("dependencyTree(Python import): get saved data", function () {
  it("jsonString", function () {
    expect(savedDataFromFile.length).to.equal(savedDataByCompute.length);
  });
});

describe("dependencyTree(Python import): get webView data", function () {
  it("dependencyTreeData", function () {
    expect(readData.length).to.equal(webViewData.length);
  });
});
