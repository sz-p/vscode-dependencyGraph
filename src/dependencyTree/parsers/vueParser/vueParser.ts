import * as vueTemplateCompiler from "vue-template-compiler";
import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
  Parsers,
  ParseRule,
} from "../../index.d";
import { parser as tsParser } from "../generalJsParser/generalJsParser";
export const parser: Parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions,
  parseRule?: ParseRule,
  parsers?: Parsers
) {
  const compileResult = vueTemplateCompiler.parseComponent(codeString);
  let dependencies = [] as string[];
  if (compileResult.script && compileResult.script.content) {
    dependencies = tsParser(
      dependencyNode,
      absolutePath,
      compileResult.script.content,
      options,
      parseRule,
      parsers
    );
  }
  if (
    compileResult.styles &&
    compileResult.styles.length &&
    parseRule &&
    parsers
  ) {
    for (let i = 0; i < compileResult.styles.length; i++) {
      let style = compileResult.styles[i];
      if (style.content) {
        let cssParser = undefined;
        if (!style.lang) {
          cssParser = parsers[parseRule[".css"]];
        } else {
          cssParser = parsers[parseRule["." + style.lang]];
        }
        if (cssParser) {
          dependencies.concat(
            cssParser(dependencyNode, absolutePath, style.content, options)
          );
        } else {
          console.warn(
            `no ${style.lang} parser please register parserRule and parser`
          );
        }
      }
    }
  }
  return dependencies;
};
