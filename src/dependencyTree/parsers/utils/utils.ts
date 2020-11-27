import { DependencyTreeData, DependencyTreeOptions } from "../../index.d";
export const triggerOnGotAST = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  options: DependencyTreeOptions,
  AST: any
) {
  if (typeof options.onGotAST === "function") {
    options.onGotAST(dependencyNode, absolutePath, AST);
  }
};
