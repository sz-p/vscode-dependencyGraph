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
export const resolveChildrenNodeError = function (
  childrenNodeName: string,
  parentNodePath: string
): void {
  console.error(
    `resolve children node '${childrenNodeName}' error in: '${parentNodePath}'`
  );
};
