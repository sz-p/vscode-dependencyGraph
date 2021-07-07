import { DependencyTreeData, DependencyHash } from "@packages/dependency-tree";
import {
  DependencyTreeData as DTD,
  DependencyNodes,
} from "../data-dependencyTree/dependencyTreeData.d";
import {
  onGotJsAST,
  onGotJsCircularStructureNode,
} from "./javascript/parseJavascript";
import { getFileIconNameByFileName } from "../utils/fileIcons/getFileIcon";
import { setFileLanguage } from "./setFileLanguage";

export const getIntroduction = function (codeString: string) {
  const reg = /@introduction (.*)(\r)?\n/i;
  const result = codeString.match(reg);
  if (result) {
    return result[1].replace("\r", "");
  } else {
    return undefined;
  }
};
export const getDescription = function (codeString: string) {
  const reg = /@description (.*)(\r)?\n/i;
  const result = codeString.match(reg);
  if (result) {
    return result[1].replace("\r", "");
  } else {
    return undefined;
  }
};

export const onGotFileString = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string
) {
  const description = getDescription(codeString);
  const introduction = getIntroduction(codeString);
  const fileInformation = { introduction, description };

  (dependencyNode as DTD).fileDescription = fileInformation;
  (dependencyNode as DTD).type = getFileIconNameByFileName(dependencyNode.name);
  setFileLanguage(dependencyNode as DTD);
  // switch (dependencyNode.extension) {
  //   case ".js":
  //   case ".ts":
  //   case ".jsx":
  //   case ".vue":
  //     onGetJsFileString(dependencyNode as DTD, absolutePath, codeString);
  // }
};

export const onGotCircularStructureNode = function (
  dependencyNode: DependencyTreeData,
  dependencyNodeHash: DependencyHash
) {
  switch (dependencyNode.extension) {
    case ".js":
    case ".ts":
    case ".jsx":
    case ".vue":
      onGotJsCircularStructureNode(dependencyNode as DTD, dependencyNodeHash);
  }
};
export const onGotAST = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  AST: any
) {
  switch (dependencyNode.extension) {
    case ".js":
    case ".ts":
    case ".jsx":
    case ".vue":
      onGotJsAST(dependencyNode as DTD, absolutePath, AST);
  }
};
