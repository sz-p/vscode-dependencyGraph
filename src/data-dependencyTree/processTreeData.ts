import * as md5 from "md5";
import { DependencyHash } from "../dependencyTree/index.d";
import { DependencyTreeData } from "./dependencyTreeData.d";
import { DependencyTree, DependencyNodes } from "./dependencyTreeData.d";
export const processDependenciesTreeData = function (
  dependencyTreeData: DependencyTreeData,
  dependencyTreeNodes: DependencyHash
): { dependencyTree: DependencyTree; dependencyNodes: DependencyNodes } {
  let dependencyNodes = {} as DependencyNodes;
  let dependencyTree = {} as DependencyTree;
  for (let key in dependencyTreeNodes) {
    const md5Hash = md5(key);
    const dependencyTreeNode = dependencyTreeNodes[key] as DependencyTreeData;
    dependencyNodes[md5Hash] = {
      fileID: md5Hash,
      name: dependencyTreeNode.name,
      circularStructure: dependencyTreeNode.circularStructure,
      type: dependencyTreeNode.type,
      extension: dependencyTreeNode.extension,
      language: dependencyTreeNode.language,
      lines: dependencyTreeNode.lines,
      analysed: dependencyTreeNode.analysed,
      absolutePath: dependencyTreeNode.absolutePath,
      relativePath: dependencyTreeNode.relativePath,
      fileDescription: dependencyTreeNode.fileDescription,
      functions: dependencyTreeNode.functions,
      children: [] as string[],
    };
    for (let i = 0; i < dependencyTreeNode.children.length; i++) {
      dependencyNodes[md5Hash].children.push(
        md5(dependencyTreeNode.children[i].absolutePath)
      );
    }
    let dependencyNode = dependencyTreeNodes[key];
    dependencyNode["ID"] = md5(key);
  }
  let dependencyTreeDataHashTable = [
    { node: dependencyTreeData, tree: dependencyTree },
  ];
  while (dependencyTreeDataHashTable.length) {
    let { node, tree } = dependencyTreeDataHashTable.pop() as {
      node: DependencyTreeData;
      tree: DependencyTree;
    };
    let fileID = md5(node.absolutePath);
    let treePath = "";
    let ancestors = [];
    for (let i = 0; i < node.ancestors.length; i++) {
      let nodeHash = md5(node.ancestors[i]);
      treePath = treePath + nodeHash;
      ancestors.push(nodeHash);
    }
    treePath += fileID;
    tree.nodeID = md5(treePath);
    tree.fileID = fileID;
    tree.name = node.name;
    tree.ancestors = ancestors;
    tree.children = [] as DependencyTree[];
    for (let i = 0; i < node.children.length; i++) {
      let treeChild = {} as DependencyTree;
      tree.children.push(treeChild);
      dependencyTreeDataHashTable.push({
        node: node.children[i],
        tree: treeChild,
      });
    }
  }
  return { dependencyNodes, dependencyTree };
};
