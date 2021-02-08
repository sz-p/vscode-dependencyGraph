import * as md5 from "md5";
import { DependencyHash } from "../dependencyTree/index.d";
import { DependencyTreeData } from "./dependencyTreeData.d";
import { DependencyTree, DependencyNodes } from "./dependencyTreeData.d";

const getFileID = function (dependencyTreeData: DependencyTreeData) {
  return md5(dependencyTreeData.relativePath);
};
const getNodeID = function (dependencyTreeData: DependencyTreeData) {
  let ancestors = [].concat(dependencyTreeData.ancestors as []) as string[];
  ancestors.push(dependencyTreeData.fileID);
  return md5(ancestors.toString());
};
const getAncestors = function (
  dependencyTreeData: DependencyTreeData,
  dirPath: string
) {
  let ancestors = [];
  for (let i = 0; i < dependencyTreeData.ancestors.length; i++) {
    const relativePath = dependencyTreeData.ancestors[i].replace(dirPath, "");
    let nodeHash = md5(relativePath);
    ancestors.push(nodeHash);
  }
  return ancestors;
};
export const dependenciesTreeDataToTransportsData = function (
  dependencyTreeData: DependencyTreeData,
  dependencyTreeNodes: DependencyHash,
  dirPath: string
): { dependencyTree: DependencyTree; dependencyNodes: DependencyNodes } {
  let dependencyNodes = {} as DependencyNodes;
  let dependencyTree = {} as DependencyTree;
  for (let key in dependencyTreeNodes) {
    const dependencyTreeNode = dependencyTreeNodes[key] as DependencyTreeData;
    const md5Hash = getFileID(dependencyTreeNode);
    dependencyNodes[md5Hash] = {
      fileID: md5Hash,
      name: dependencyTreeNode.name,
      circularStructure: dependencyTreeNode.circularStructure,
      type: dependencyTreeNode.type,
      extension: dependencyTreeNode.extension,
      language: dependencyTreeNode.language,
      lines: dependencyTreeNode.lines,
      analysed: dependencyTreeNode.analysed,
      relativePath: dependencyTreeNode.relativePath,
      fileDescription: dependencyTreeNode.fileDescription,
      functions: dependencyTreeNode.functions,
      children: [] as string[],
    };
    for (let i = 0; i < dependencyTreeNode.children.length; i++) {
      dependencyNodes[md5Hash].children.push(
        getFileID(dependencyTreeNode.children[i])
      );
    }
    let dependencyNode = dependencyTreeNodes[key];
    dependencyNode["fileID"] = md5Hash;
  }
  let dependencyTreeDataHashTable = [
    { node: dependencyTreeData, tree: dependencyTree },
  ];
  while (dependencyTreeDataHashTable.length) {
    let { node, tree } = dependencyTreeDataHashTable.pop() as {
      node: DependencyTreeData;
      tree: DependencyTree;
    };
    tree.name = node.name;
    tree.nodeID = getNodeID(node);
    tree.fileID = getFileID(node);
    node.nodeID = tree.nodeID;
    node.fileID = tree.fileID;
    tree.ancestors = getAncestors(node, dirPath);
    node.ancestors = tree.ancestors;
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
export const transportsDataToDependenciesTreeData = function (
  dependencyTree: DependencyTree,
  dependencyNodes: DependencyNodes,
  dirPath: string
): DependencyTreeData {
  let dependencyTreeData = {} as DependencyTreeData;

  let dependencyTreeDataHashTable = [
    { dependencyTree: dependencyTree, dependencyTreeData: dependencyTreeData },
  ];
  while (dependencyTreeDataHashTable.length) {
    let {
      dependencyTree,
      dependencyTreeData,
    } = dependencyTreeDataHashTable.pop() as {
      dependencyTree: DependencyTree;
      dependencyTreeData: DependencyTreeData;
    };
    const nodesData = dependencyNodes[dependencyTree.fileID];

    dependencyTreeData.name = dependencyTree.name;
    dependencyTreeData.fileID = dependencyTree.fileID;
    dependencyTreeData.nodeID = dependencyTree.nodeID;
    dependencyTreeData.ancestors = dependencyTree.ancestors;
    dependencyTreeData.fileDescription = nodesData.fileDescription;
    dependencyTreeData.circularStructure = nodesData.circularStructure;
    dependencyTreeData.type = nodesData.type;
    dependencyTreeData.language = nodesData.language;
    dependencyTreeData.lines = nodesData.lines;
    dependencyTreeData.analysed = nodesData.analysed;
    dependencyTreeData.functions = nodesData.functions;
    dependencyTreeData.extension = nodesData.extension;
    dependencyTreeData.absolutePath = dirPath + nodesData.relativePath;
    dependencyTreeData.relativePath = nodesData.relativePath;
    dependencyTreeData.children = [] as DependencyTreeData[];

    for (let i = 0; i < dependencyTree.children.length; i++) {
      let child = {} as DependencyTreeData;
      dependencyTreeData.children.push(child);
      dependencyTreeDataHashTable.push({
        dependencyTree: dependencyTree.children[i],
        dependencyTreeData: child,
      });
    }
  }
  return dependencyTreeData;
};
