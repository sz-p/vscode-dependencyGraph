import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
  Parsers,
} from "../../index.d";
import { triggerOnGotAST, resolveChildrenNodeError } from "../utils/utils";
import { visit } from "recast";
import * as path from "path";
import * as Resolve from "enhanced-resolve";

import * as tsParser from "recast/parsers/typescript";
const babelOption = {};
export const parser: Parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions
) {
  const dirName = path.dirname(absolutePath);
  let ast = undefined;
  let dependencies = [] as string[];
  try {
    ast = tsParser.parse(codeString, babelOption);
  } catch (e) {
    console.error(`get AST error: ${absolutePath}`);
  }
  if (!ast) {
    console.error(`get AST error: ${absolutePath}`);
    return dependencies;
  }
  triggerOnGotAST(dependencyNode, absolutePath, options, ast);
  const { resolveExtensions, alias } = options;
  visit(ast, {
    visitImportDeclaration(nodePath) {
      if (typeof nodePath.node.source.value !== "string") return false;

      const resolve = Resolve.create.sync({
        extensions: resolveExtensions,
        alias: alias,
      });
      let dependencyPath = undefined;
      try {
        dependencyPath = resolve(dirName, nodePath.node.source.value);
      } catch (e) {
        resolveChildrenNodeError(nodePath.node.source.value, absolutePath);
        return false;
      }
      if (typeof dependencyPath === "string") {
        if (dependencyPath.includes("node_modules")) {
          // TODO parse package dependencies
          return false;
        }
        dependencies.push(dependencyPath);
      }
      return false;
    },
    visitIdentifier(nodePath) {
      if (nodePath.name !== "require") {
        return false;
      } else {
        //TODO get require file
        console.log("require");
      }
      return false;
    },
  });
  return dependencies;
};
