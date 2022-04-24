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
} = getDependencyTreeDataFromFile("moreThanOneCircularStructure");
// const folderPath = path.join(__dirname, `./files`)
const { dependencyTree, dependencyNodes } = getDependencyTreeDataByCompute(
  folderPath,
  mainFilePath
);
const savedDataFromFile = getSavedDataFromFile("moreThanOneCircularStructure");
const savedDataByCompute = getSavedDataByCompute(
  "moreThanOneCircularStructure",
  folderPath,
  mainFilePath
);
const readData = getWebViewDataByCompute("moreThanOneCircularStructure", folderPath);
const webViewData = getWebViewDataFromFile("moreThanOneCircularStructure");
describe("dependencyTree(more than one circularStructure node): get dependencyTree data", function () {
  it("dependencyNodesData", function () {
    // setDataToFile("./dependencyNodes.json", dependencyNodes)
    expect(dependencyNodesData.length).to.equal(dependencyNodes.length);
  });
  it("dependencyTreeData", function () {
    // setDataToFile("./dependencyTree.json", dependencyTree)
    expect(dependencyTreeData.length).to.equal(dependencyTree.length);
  });
});
// setDataToFile("./savedData.json", savedDataByCompute);
// setDataToFile("./webViewData.json", readData);

describe("dependencyTree(more than one circularStructure node): get saved data", function () {
  it("jsonString", function () {
    // setDataToFile("./savedData.json", savedDataByCompute)
    expect(savedDataFromFile.length).to.equal(savedDataByCompute.length);
  });
});

describe("dependencyTree(more than one circularStructure node): get webView data", function () {
  it("dependencyTreeData", function () {
    // setDataToFile("./webViewData.json", readData)
    expect(readData.length).to.equal(webViewData.length);
  });
});
