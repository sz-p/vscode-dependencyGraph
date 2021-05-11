import { namedTypes } from "ast-types";
import { NodePath } from "ast-types/lib/node-path";
import { resolveChildrenNodeError } from "./utils";

export const visitOnExportDeclaration = function (nodePath: NodePath<namedTypes.ExportAllDeclaration, any> | NodePath<namedTypes.ExportNamedDeclaration, any>, dependencies: string[], dirName: string, resolve: (context?: any, path?: any, request?: any) => string | false, absolutePath: string): string | false {
  if (nodePath?.value?.source?.type === "StringLiteral") {
    let dependencyPath = undefined;
    try {
      dependencyPath = resolve(dirName, nodePath.value.source.value);
    } catch (e) {
      resolveChildrenNodeError(absolutePath, nodePath.value.source.value,)
      return false
    }
    return dependencyPath;
  }
  return false;
}
