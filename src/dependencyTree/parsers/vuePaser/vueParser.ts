import * as vueTemplateCompiler from "vue-template-compiler";
import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
} from "../../index.d";
import { parser as tsParser } from "../tsParser/tsParser";
export const parser: Parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions
) {
  const compileResult = vueTemplateCompiler.parseComponent(codeString);
  let dependencies = [] as string[];
  if (compileResult.script && compileResult.script.content) {
    dependencies = tsParser(
      dependencyNode,
      absolutePath,
      compileResult.script.content,
      options
    );
  }
  return dependencies;
};
