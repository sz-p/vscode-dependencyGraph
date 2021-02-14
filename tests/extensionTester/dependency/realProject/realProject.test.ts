import { getDependencyTreeDataFromFile, getDependencyTreeDataByCompute, getSavedDataFromFile, getSavedDataByCompute } from "../utils";
import { expect } from 'chai';
const mainFilePath = "./src/index.js";
const { dependencyTreeData, dependencyNodesData, folderPath } = getDependencyTreeDataFromFile("realProject")
const { dependencyTree, dependencyNodes } = getDependencyTreeDataByCompute(folderPath, mainFilePath);
const savedDataFromFile = getSavedDataFromFile("realProject")
const savedDataByCompute = getSavedDataByCompute("realProject", folderPath, mainFilePath);

describe("get dependencyTree data real project", function () {
  it("dependencyNodesData", function () {
    expect(dependencyTreeData).to.equal(dependencyTree);
  });
  it("dependencyTreeData", function () {
    expect(dependencyNodesData).to.equal(dependencyNodes);
  });
});

describe("get saved data real project", function () {
  it("jsonString", function () {
    expect(savedDataFromFile).to.equal(savedDataByCompute);
  });
});
