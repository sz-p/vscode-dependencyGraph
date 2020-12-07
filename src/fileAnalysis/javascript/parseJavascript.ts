import { DependencyTreeData } from "../../data-dependencyTree/dependencyTreeData.d";

export const onGetJsFileString = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string
) {};
export const onGotJsAST = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  AST: any
) {};
