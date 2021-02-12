import * as path from "path";
import * as fs from "fs";
import { getDependencyTree } from "../../../src/dependencyTree/index";
import { defaultOptions } from "../../../src/dependencyTree/core/defaultOptions";
import {
  onGotAST,
  onGotCircularStructureNode,
  onGotFileString,
} from "../../../src/fileAnalysis/fileAnalysis";
const resolveExtensions = defaultOptions.resolveExtensions;
const alias = {};

export const getDependencyTreeDataFromFile = function (testCase: string) {
  const dependencyTreeData = fs.readFileSync(path.resolve(__dirname, `./${testCase}/dependencyTreeData/dependencyTree.json`)).toString();
  const dependencyNodesData = fs.readFileSync(path.resolve(__dirname, `./${testCase}/dependencyTreeData/dependencyNodes.json`)).toString();
  const folderPath = path.join(__dirname, `./${testCase}/files/`);
  return { dependencyTreeData, dependencyNodesData, folderPath }
}
export const getDependencyTreeDataByCompute = function (folderPath: string, mainFilePath: string) {
  const dirPathString = JSON.stringify(folderPath).replace(/"/g, "").replace(/\\/g, "\\\\");
  const replaceDirPathReg = new RegExp(dirPathString, 'g')

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
  return { dependencyTree: JSON.stringify(dt, null, 2).replace(replaceDirPathReg, "%DIR-PATH%"), dependencyNodes: JSON.stringify(dn, null, 2).replace(replaceDirPathReg, "%DIR-PATH%") }
}
