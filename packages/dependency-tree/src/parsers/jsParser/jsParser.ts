import * as babelParser from "recast/parsers/babel";
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
  return generalJavaScriptParser(dependencyNode, absolutePath, codeString, options, babelParser)
}
