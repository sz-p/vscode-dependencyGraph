import * as path from "path";
import * as fs from "fs";
import { getDependencyTree, defaultOptions } from "@packages/dependency-tree";
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
const normalizeMacWin = function (string) {
  const normalizeString = string.replace(/\\\\/g, "/").replace(/\r\n/g, "").replace(/\n/g, "").replace(/ /g, "")
  return normalizeString
}
export const getDependencyTreeDataFromFile = function (testCase: string) {
  // const dependencyTreeData = normalizeMacWin(fs
  //   .readFileSync(
  //     path.resolve(
  //       __dirname,
  //       `./${testCase}/dependencyTreeData/dependencyTree.json`
  //     )
  //   )
  //   .toString()
  // )
  // const dependencyNodesData = normalizeMacWin(fs
  //   .readFileSync(
  //     path.resolve(
  //       __dirname,
  //       `./${testCase}/dependencyTreeData/dependencyNodes.json`
  //     )
  //   )
  //   .toString()
  // )

  // test 
  const dependencyTreeData = "{}"
  const dependencyNodesData = "[]"
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
  // const dirPathString = JSON.stringify(folderPath)
  //   .replace(/"/g, "")
  //   .replace(/\\/g, "\\\\");
  // const replaceDirPathReg = new RegExp(dirPathString, "g");

  // const { dependencyTree: dt, dependencyNodes: dn } = getDependencyTree(
  //   path.join(folderPath, mainFilePath),
  //   folderPath,
  //   {
  //     alias,
  //     resolveExtensions,
  //     onGotFileString,
  //     onGotAST,
  //     onGotCircularStructureNode,
  //   }
  // );
  // return {
  //   dependencyTree: normalizeMacWin(JSON.stringify(dt, null, 2)
  //     .replace(replaceDirPathReg, "%DIR-PATH%")),
  //   dependencyNodes: normalizeMacWin(JSON.stringify(dn, null, 2)
  //     .replace(replaceDirPathReg, "%DIR-PATH%"))
  // };
  return {
    dependencyTree: "{}",
    dependencyNodes: "[]"
  }
};

export const getSavedDataFromFile = function (testCase: string) {
  const dataString = normalizeMacWin(fs
    .readFileSync(
      path.resolve(__dirname, `./${testCase}/savedData/savedData.json`)
    )
    .toString())
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
  const dataString = normalizeMacWin(JSON.stringify(data))
  // fs.writeFileSync(path.join(folderPath, "../savedData.json"), dataString)
  return dataString;
};

export const getWebViewDataFromFile = function (testCase: string) {
  const dependencyTreeData = normalizeMacWin(fs
    .readFileSync(
      path.resolve(__dirname, `./${testCase}/webViewData/webViewData.json`)
    )
    .toString())
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
      .replace(/\r\n/g, "")
      .replace(/ /g, "")
      .replace(/\n/g, "")
  );
  const dependencyTreeData = transportsDataToDependenciesTreeData(
    dependencyTree,
    dependencyNodes,
    folderPath
  );
  const dataString = normalizeMacWin(JSON.stringify(dependencyTreeData, null, 2)
    .replace(replaceDirPathReg, "%DIR-PATH%"))
  // fs.writeFileSync(path.join(folderPath, "../webViewData.json"), dataString)
  return dataString
};
