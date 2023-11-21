import {
  DependencyHash,
  DependencyTreeData,
} from "../index.d";
export const onGetFileString = function (
  callBack: Function | undefined,
  dependencyNode: DependencyTreeData,
  absolutePath: string,
  codeString: string
) {
  if (typeof callBack === "function") {
    callBack(dependencyNode, absolutePath, codeString);
  }
}
export const onGetNewDependencyTreeNode = function (
  callBack: Function | undefined,
  dependencyNode: DependencyTreeData
) {
  if (typeof callBack === "function") {
    callBack(dependencyNode);
  }
}
export const onGetOldDependencyTreeNode = function (
  callBack: Function | undefined,
  dependencyNode: DependencyTreeData
) {
  if (typeof callBack === "function") {
    callBack(dependencyNode);
  }
}
export const onGetCircularStructureNode = function (
  callBack: Function | undefined,
  dependencyNode: DependencyTreeData,
  dependencyHash: DependencyHash
) {
  if (typeof callBack === "function") {
    callBack(dependencyNode, dependencyHash);
  }
}

export class Events {

}
