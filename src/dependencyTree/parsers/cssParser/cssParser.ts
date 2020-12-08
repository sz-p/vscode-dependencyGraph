import * as postcss from "postcss";
import * as Resolve from "enhanced-resolve";
import {
  Parser,
  DependencyTreeData,
  DependencyTreeOptions,
} from "../../index.d";
import * as path from "path";
export const parser: Parser = function (
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string,
  options: DependencyTreeOptions
) {
  let dependencies = [] as string[];
  console.log(postcss);
  let root = undefined;
  try {
    root = postcss.parse(codeString);
  } catch (err) {
    console.error(`get AST error: ${absolutePath}`);
  }
  if (!root) {
    console.error(`get AST error: ${absolutePath}`);
    return dependencies;
  }
  const { resolveExtensions, alias } = options;
  const dirName = path.dirname(absolutePath);
  const resolve = Resolve.create.sync({
    extensions: resolveExtensions,
    alias: alias,
  });

  root.walkAtRules("import", (rule) => {
    let dependencyPath = undefined;
    try {
      dependencyPath = resolve(
        dirName,
        rule.params.replace(/\'/g, "").replace(/\"/g, "")
      );
    } catch (e) {
      console.error(`resolve children node error: ${absolutePath}`);
      return false;
    }
    if (dependencyPath) {
      if (dependencyPath.includes("node_modules")) {
        // TODO parse package dependencies
        return false;
      }
      dependencies.push(dependencyPath);
    }
  });
  return dependencies;
};
