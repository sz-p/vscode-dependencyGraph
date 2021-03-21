import * as path from "path";
import * as fs from "fs";
import { getDependencyTree } from "../../../src/dependencyTree/index";
import { defaultOptions } from "../../../src/dependencyTree/core/defaultOptions";
import {
  onGotAST,
  onGotCircularStructureNode,
  onGotFileString,
} from "../../../src/fileAnalysis/fileAnalysis";
import {
  dependenciesTreeDataToTransportsData,
  transportsDataToDependenciesTreeData,
} from "../../../src/data-dependencyTree/processTreeData";
import { DependencyTreeData } from "../../../src/data-dependencyTree/dependencyTreeData";

const resolveExtensions = defaultOptions.resolveExtensions;
const alias = {};

export const getDependencyTreeDataFromFile = function (testCase: string) {
  const dependencyTreeData = fs
    .readFileSync(
      path.resolve(
        __dirname,
        `./${testCase}/dependencyTreeData/dependencyTree.json`
      )
    )
    .toString()
    .replace(/\r\n/g, "\n");
  const dependencyNodesData = fs
    .readFileSync(
      path.resolve(
        __dirname,
        `./${testCase}/dependencyTreeData/dependencyNodes.json`
      )
    )
    .toString()
    .replace(/\r\n/g, "\n");
  const folderPath = path.join(__dirname, `./${testCase}/files`);
  return { dependencyTreeData, dependencyNodesData, folderPath };
};
export const setDataToFile = function (_path: string, dataString: string) {
  fs.writeFileSync(path.join(__dirname, _path), dataString)
}
export const getDependencyTreeDataByCompute = function (
  folderPath: string,
  mainFilePath: string
) {
  const dirPathString = JSON.stringify(folderPath)
    .replace(/"/g, "")
    .replace(/\\/g, "\\\\");
  const replaceDirPathReg = new RegExp(dirPathString, "g");

  const { dependencyTree: dt, dependencyNodes: dn } = getDependencyTree(
    path.join(folderPath, mainFilePath),
    folderPath,
    {
      alias,
      resolveExtensions,
      onGotFileString,
      onGotAST,
      onGotCircularStructureNode,
    }
  );
  return {
    dependencyTree: JSON.stringify(dt, null, 2)
      .replace(replaceDirPathReg, "%DIR-PATH%")
      .replace(/\r\n/g, "\n"),
    dependencyNodes: JSON.stringify(dn, null, 2)
      .replace(replaceDirPathReg, "%DIR-PATH%")
      .replace(/\r\n/g, "\n"),
  };
};

export const getSavedDataFromFile = function (testCase: string) {
  const dataString = fs
    .readFileSync(
      path.resolve(__dirname, `./${testCase}/savedData/savedData.json`)
    )
    .toString()
    .replace(/\r\n/g, "\n");
  return dataString;
};
export const getSavedDataByCompute = function (
  testCase: string,
  folderPath: string,
  mainFilePath: string
) {
  const { dependencyTree: dt, dependencyNodes: dn } = getDependencyTree(
    path.join(folderPath, mainFilePath),
    folderPath,
    {
      alias,
      resolveExtensions,
      onGotFileString,
      onGotAST,
      onGotCircularStructureNode,
    }
  );
  const data = dependenciesTreeDataToTransportsData(
    dt as DependencyTreeData,
    dn,
    folderPath
  );
  return JSON.stringify(data).replace(/\r\n/g, "\n");
};

export const getWebViewDataFromFile = function (testCase: string) {
  const dependencyTreeData = fs
    .readFileSync(
      path.resolve(__dirname, `./${testCase}/webViewData/webViewData.json`)
    )
    .toString()
    .replace(/\r\n/g, "\n");
  return dependencyTreeData;
};

export const getWebViewDataByCompute = function (
  testCase: string,
  folderPath: string
) {
  const dirPathString = JSON.stringify(folderPath)
    .replace(/"/g, "")
    .replace(/\\/g, "\\\\");
  const replaceDirPathReg = new RegExp(dirPathString, "g");

  const { dependencyTree, dependencyNodes } = JSON.parse(
    fs
      .readFileSync(
        path.resolve(__dirname, `./${testCase}/savedData/savedData.json`)
      )
      .toString()
      .replace(/\r\n/g, "\n")
  );
  const dependencyTreeData = transportsDataToDependenciesTreeData(
    dependencyTree,
    dependencyNodes,
    folderPath
  );
  return JSON.stringify(dependencyTreeData, null, 2)
    .replace(replaceDirPathReg, "%DIR-PATH%")
    .replace(/\r\n/g, "\n");
};
