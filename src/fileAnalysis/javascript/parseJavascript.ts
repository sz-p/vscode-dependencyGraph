import {
  DependencyTreeData,
  FunctionInformation,
} from "../../data-dependencyTree/dependencyTreeData.d";
import { getFunctionInformation } from "./getFunctionInformation";
import { i18n } from "../../i18n/i18n";
import { getFileIconNameByFileName } from "../../utils/fileIcons/getFileIcon";
import { DependencyHash } from "../../dependencyTree/index.d"
import { visit } from "recast";
import {
  CIRCULAR_STRUCTURE_NODE_INTRODUCTION,
  CIRCULAR_STRUCTURE_NODE_DESCRIPTION,
} from "../../i18n/types";

export const onGotJsAST = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  AST: any
) {
  const functionsList = [] as FunctionInformation[];
  dependencyNode.analysed = true;
  dependencyNode.lines = AST.loc?.end.line;
  visit(AST, {
    visitFunction(nodePath) {
      const functionInfo = getFunctionInformation(nodePath);
      functionsList.push(functionInfo);
      return false;
    },
  });
  dependencyNode.functions = functionsList;
};

export const onGotJsCircularStructureNode = function (
  dependencyNode: DependencyTreeData,
  dependencyNodeHash: DependencyHash
) {
  const circularStructureNode = dependencyNode.children[0];
  circularStructureNode.type = getFileIconNameByFileName(circularStructureNode.name);
  circularStructureNode.analysed = false;
  circularStructureNode.fileDescription = {
    introduction: i18n.getText(CIRCULAR_STRUCTURE_NODE_INTRODUCTION),
    description: i18n.getText(CIRCULAR_STRUCTURE_NODE_DESCRIPTION),
  };
  dependencyNodeHash[circularStructureNode.name] = circularStructureNode;
};
