import {
  getDependencyTreeDataFromFile,
  getDependencyTreeDataByCompute,
  getWebViewDataByCompute,
  getSavedDataFromFile,
  getSavedDataByCompute,
  getWebViewDataFromFile,
} from "../utils";
import { expect } from 'chai';
const mainFilePath = "./src/index.js";
const {
  dependencyTreeData,
  dependencyNodesData,
  folderPath,
} = getDependencyTreeDataFromFile("aboveFatherNode");
// const folderPath = path.join(__dirname, `./files`)
const { dependencyTree, dependencyNodes } = getDependencyTreeDataByCompute(
  folderPath,
  mainFilePath
);
const savedDataFromFile = getSavedDataFromFile("aboveFatherNode");
const savedDataByCompute = getSavedDataByCompute(
  "aboveFatherNode",
  folderPath,
  mainFilePath
);
const readData = getWebViewDataByCompute("aboveFatherNode", folderPath);
const webViewData = getWebViewDataFromFile("aboveFatherNode");
describe("dependencyTree(above father node): get dependencyTree data", function () {
  it("dependencyNodesData", function () {
    expect(dependencyNodesData.length).to.equal(dependencyNodes.length);
  });
  it("dependencyTreeData", function () {
    expect(dependencyTreeData.length).to.equal(dependencyTree.length);
  });
});

describe("dependencyTree(above father node): get saved data", function () {
  it("jsonString", function () {
    expect(savedDataFromFile.length).to.equal(savedDataByCompute.length);
  });
});

describe("dependencyTree(above father node): get webView data", function () {
  it("dependencyTreeData", function () {
    expect(readData.length).to.equal(webViewData.length);
  });
});
