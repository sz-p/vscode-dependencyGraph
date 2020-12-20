import { DependencyTreeData } from "../dependencyTree/index.d";
import { DependencyTreeData as DTD } from "../data-dependencyTree/dependencyTreeData.d";
import {
  onGotJsAST,
  onGotJsCircularStructureNode,
} from "./javascript/parseJavascript";
import { getFileIconNameByFileName } from "../utils/fileIcons/getFileIcon";
import { setFileLanguage } from "./setFileLanguage";

const getIntroduction = function (codeString: string) {
  const reg = /@introduction (.*)\n/;
  const result = codeString.match(reg);
  if (result) {
    return result[1].replace("\r", "");
  } else {
    return undefined;
  }
};
const getDescription = function (codeString: string) {
  const reg = /@description (.*)\n/;
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
  dependencyNode: DependencyTreeData
) {
  switch (dependencyNode.extension) {
    case ".js":
    case ".ts":
    case ".jsx":
    case ".vue":
      onGotJsCircularStructureNode(dependencyNode as DTD);
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
