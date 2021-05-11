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
} = getDependencyTreeDataFromFile("exportDeclaration");
// const folderPath = path.join(__dirname, `./files`)
const { dependencyTree, dependencyNodes } = getDependencyTreeDataByCompute(
  folderPath,
  mainFilePath
);
const savedDataFromFile = getSavedDataFromFile("exportDeclaration");
const savedDataByCompute = getSavedDataByCompute(
  "exportDeclaration",
  folderPath,
  mainFilePath
);
const readData = getWebViewDataByCompute("exportDeclaration", folderPath);
const webViewData = getWebViewDataFromFile("exportDeclaration");
describe("dependencyTree(export declaration): get dependencyTree data", function () {
  it("dependencyNodesData", function () {
    expect(dependencyNodesData.length).to.equal(dependencyNodes.length);
  });
  it("dependencyTreeData", function () {
    expect(dependencyTreeData.length).to.equal(dependencyTree.length);
  });
});
// setDataToFile("./savedData.json", savedDataByCompute);
setDataToFile("./webViewData.json", readData);

describe("dependencyTree(export declaration): get saved data", function () {
  it("jsonString", function () {
    expect(savedDataFromFile.length).to.equal(savedDataByCompute.length);
  });
});

describe("dependencyTree(export declaration): get webView data", function () {
  it("dependencyTreeData", function () {
    expect(readData.length).to.equal(webViewData.length);
  });
});
