import * as tsParser from "recast/parsers/typescript";
import { parser as generalTsParser } from "../generalTsParser/generalTsParser"
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
  return generalTsParser(dependencyNode, absolutePath, codeString, options, tsParser)
}
