import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
  Parsers
} from "../../index.d";
export const parser: Parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions,
  parsers?: Parsers
) {
  let dependencies = [] as string[];
  return dependencies;
};
