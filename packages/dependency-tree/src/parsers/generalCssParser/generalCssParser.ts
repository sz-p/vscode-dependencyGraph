import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
  Parsers,
} from "../../index.d";
import * as Resolve from "enhanced-resolve";
import * as path from "path";
import { resolveChildrenNodeError } from "../utils/utils";

const getCssImport = function (codeString: string): string[] {
  const reg = /@import (.*);/g;
  const results = codeString.match(reg);
  let importedPath = [] as string[];
  if (results) {
    for (let i = 0; i < results.length; i++) {
      importedPath.push(
        results[i]
          .replace(/\'/g, "")
          .replace(/\"/g, "")
          .replace(/ /g, "")
          .replace("@import", "")
          .replace(";", "")
      );
    }
  }
  return importedPath;
};

// get dependencies use reg is enough no need to get AST in css file;
export const parser: Parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions
) {
  let dependencies = [] as string[];
  const { resolveExtensions, alias } = options;
  const dirName = path.dirname(absolutePath);
  const resolve = Resolve.create.sync({
    extensions: resolveExtensions,
    alias: alias,
  });
  const importedPath = getCssImport(codeString);
  for (let i = 0; i < importedPath.length; i++) {
    let dependencyPath = undefined;
    try {
      dependencyPath = resolve(dirName, importedPath[i]);
    } catch (e) {
      resolveChildrenNodeError(importedPath[i], absolutePath);
      continue;
    }
    if (typeof dependencyPath === "string") {
      if (dependencyPath.includes("node_modules")) {
        // TODO parse package dependencies
        continue;
      }
      dependencies.push(dependencyPath);
    }
  }
  return dependencies;
};
