import * as tsParser from "recast/parsers/babel-ts";
import { parser as generalJavaScriptParser } from "../generalJavaScriptParser/generalJavaScriptParser"
import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
  Parsers,
} from "../../index.d";
export const parser: Parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions,
) {
  return generalJavaScriptParser(dependencyNode, absolutePath, codeString, options, tsParser)
}
