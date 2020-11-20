import { File } from "@babel/types";
import * as vueTemplateCompiler from "vue-template-compiler";
import { parseJsCode } from "./parseJsCode";
export const parseVueCode = function (vueString: string): File | undefined {
  const compileResult = vueTemplateCompiler.parseComponent(vueString);
  if (compileResult.script && compileResult.script.content) {
    return parseJsCode(compileResult.script.content);
  } else {
    return undefined;
  }
};
