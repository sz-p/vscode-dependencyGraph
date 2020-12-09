import * as vueTemplateCompiler from "vue-template-compiler";
import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
  Parsers,
} from "../../index.d";
import { parser as cssParser } from "../cssParser/cssParser";
import { parser as tsParser } from "../generalJsParser/generalJsParser";
export const parser: Parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions,
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
      parsers
    );
  }
  if (compileResult.styles && compileResult.styles.length) {
    for (let i = 0; i < compileResult.styles.length; i++) {
      let style = compileResult.styles[i];
      if (style.content) {
        // console.log(style.lang);
        // console.log(parsers);
        // switch (style.lang) {
        //   case "scss":
        //     dependencies.concat(
        //       cssParser(
        //         dependencyNode,
        //         style.content,
        //         codeString,
        //         options,
        //         parsers
        //       )
        //     );
        //   case "less":
        //   case "sass":
        //   default:
        //     dependencies.concat(
        //       cssParser(
        //         dependencyNode,
        //         style.content,
        //         codeString,
        //         options,
        //         parsers
        //       )
        //     );
        // }
      }
    }
  }
  return dependencies;
};
