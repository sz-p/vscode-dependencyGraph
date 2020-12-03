import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
} from "../../index.d";
import { triggerOnGotAST } from "../utils/utils";
import { visit } from "recast";
import * as path from "path";
import * as Resolve from "enhanced-resolve";

import * as babelParser from "recast/parsers/babel";
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
    ast = babelParser.parse(codeString, babelOption);
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
      const dependencyPath = resolve(dirName, nodePath.node.source.value);
      if (dependencyPath) dependencies.push(dependencyPath);
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
