import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
  Parsers,
} from "../../index.d";
import { triggerOnGotAST, resolveChildrenNodeError } from "../utils/utils";
import { Overrides } from "recast/parsers/_babel_options"
import { visit } from "recast";
import * as path from "path";
import * as Resolve from "enhanced-resolve";
import { visitOnExportDeclaration } from "../utils/utils-js";

const babelOption = {};
export const parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions,
  parser: { parse(source: string, options?: Overrides): import("@babel/types").File }
) {
  const dirName = path.dirname(absolutePath);
  let ast = undefined;
  let dependencies = [] as string[];
  try {
    ast = parser.parse(codeString, babelOption);
  } catch (e) {
    console.error(`get AST error: ${absolutePath}`);
  }
  if (!ast) {
    console.error(`get AST error: ${absolutePath}`);
    return dependencies;
  }
  triggerOnGotAST(dependencyNode, absolutePath, options, ast);
  const { resolveExtensions, alias } = options;
  const resolve = Resolve.create.sync({
    extensions: resolveExtensions,
    alias: alias,
  });
  visit(ast, {
    visitImportDeclaration(nodePath) {
      if (typeof nodePath.node.source.value !== "string") return false;
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
    visitExportNamedDeclaration(nodePath) {
      const dependencyPath = visitOnExportDeclaration(nodePath, dependencies, dirName, resolve, absolutePath)
      if (!dependencyPath) {
        return false;
      }
      // TODO add excludes option
      if (dependencyPath.includes("node_modules")) {
        return false;
      }
      dependencies.push(dependencyPath);
      return false;
    },
    visitExportAllDeclaration(nodePath) {
      const dependencyPath = visitOnExportDeclaration(nodePath, dependencies, dirName, resolve, absolutePath)
      if (!dependencyPath) {
        return false;
      }
      // TODO add excludes option
      if (dependencyPath.includes("node_modules")) {
        return false;
      }
      dependencies.push(dependencyPath);
      return false;
    },
    visitCallExpression(nodePath) {
      let dependencyPath = undefined;
      const node = nodePath.value;
      const expressionArguments = node?.arguments;
      // import(xxx)
      if (node?.callee?.type === 'Import' || node?.callee?.name === 'require') {
        if (node.arguments?.length && node.arguments[0]?.type === "StringLiteral") {
          const expressionArgument = node.arguments[0];
          try {
            dependencyPath = resolve(dirName, expressionArgument.value);
          } catch (e) {
            resolveChildrenNodeError(expressionArgument.value, absolutePath);
            return false;
          }
          if (typeof dependencyPath === "string") {
            if (dependencyPath.includes("node_modules")) {
              return false;
            }
            dependencies.push(dependencyPath);
          }
        }
      }
      if (expressionArguments && expressionArguments.length > 0) {
        for (let i = 0; i < expressionArguments.length; i++) {
          if (expressionArguments[i].type === "CallExpression") {
            this.visitor.visitCallExpression.bind(this)({ value: expressionArguments[i] });
          }
          if (expressionArguments[i].type === "ArrowFunctionExpression") {
            this.visitor.visitCallExpression.bind(this)({ value: expressionArguments[i].body });
          }
        }
      }
      return false
    }
  });
  return dependencies;
};
