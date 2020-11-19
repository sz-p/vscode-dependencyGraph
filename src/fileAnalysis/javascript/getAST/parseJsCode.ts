import { File } from "@babel/types";
import * as babelParser from "recast/parsers/babel";
const option = {};
export const parseJsCode = function (codeString: string): File | undefined {
  let ast = undefined;
  try {
    ast = babelParser.parse(codeString, option);
  } catch (e) {
    //TODO catch error
  }
  return ast;
};
