/**
 * @introduction process dependency tree data
 *
 * @description mini the data size \n change 'DependencyTreeData' to DependencyTree & DependencyNodes
 */
import * as md5 from "md5";
import { DependencyHash } from "@packages/dependency-tree";
import { DependencyTreeData } from "./dependencyTreeData.d";
import { DependencyTree, DependencyNodes, DependencyNode } from "./dependencyTreeData.d";

const getFileID = function (dependencyTreeData: DependencyTreeData) {
  try {
    return md5(dependencyTreeData.relativePath);
  }
  catch (e) {
    new Error(e)
  }
};
const getChildNodeID = function (parentNodeID: string, fileID: string) {
  const md5Hash = md5(parentNodeID + fileID);
  return md5Hash
};
// const getParentId = function (
//   dependencyTreeData: DependencyTreeData,
//   dirPath: string
// ) {
//   let ancestors = [];
//   for (let i = 0; i < dependencyTreeData.ancestors.length; i++) {
//     const relativePath = dependencyTreeData.ancestors[i].replace(dirPath, "");
//     let nodeHash = md5(relativePath);
//     ancestors.push(nodeHash);
//   }
//   return ancestors;
// };
export const dependenciesTreeDataToTransportsData = function (
  dependencyTreeData: DependencyTreeData,
  dependencyTreeNodes: DependencyHash,
  dirPath: string
): { dependencyTree: DependencyTree; dependencyNodes: DependencyNodes } {
  // console.log(`开始数据转换`)
  let dependencyNodes = {} as DependencyNodes;
  let dependencyTree = {} as DependencyTree;
  // change DependencyHash to DependencyNodes (change the hash table key from absolutePath to relativePath md5)
  // set fileID
  let dependencyNodeCount = 0;
  let dependencyTreeDataHashTableNodeCount = 0;
  for (let key in dependencyTreeNodes) {
    dependencyNodeCount++;
    // console.log(`已分离的文件数量：${dependencyNodeCount}`)
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
      analyzed: dependencyTreeNode.analyzed,
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
    { node: { ...dependencyTreeData, nodeDeep: 0 }, tree: dependencyTree },
  ];
  // create DependencyTree by DependencyNodes and DependencyTreeData
  // set nodeID
  while (dependencyTreeDataHashTable.length) {
    dependencyTreeDataHashTableNodeCount++;
    // console.log(`已分离的节点数量：${dependencyTreeDataHashTableNodeCount}`)
    let { node, tree } = dependencyTreeDataHashTable.shift() as {
      node: DependencyTreeData;
      tree: DependencyTree;
    };
    tree.name = node.name;
    tree.fileID = getFileID(node);
    node.fileID = tree.fileID;
    node.nodeID = tree.nodeID;
    tree.children = [] as DependencyTree[];
    for (let i = 0; i < node.children.length; i++) {
      let treeChild = {
        parentNodeID: tree.nodeID
      } as DependencyTree;
      tree.children.push(treeChild);
      const nextDeep = node.nodeDeep + 1;
      // TODO
      // if (nextDeep > 3) {
      //   treeChild.children = [];
      //   continue
      // }
      dependencyTreeDataHashTable.push({
        node: { ...node.children[i], nodeDeep: nextDeep },
        tree: treeChild,
      });
    }
  }
  // console.log(`数据转换完毕`)
  return { dependencyTree, dependencyNodes };
};
export const transportsDataToDependenciesTreeData = function (
  dependencyTree: DependencyTree,
  dependencyNodes: DependencyNodes,
  dirPath: string
): DependencyTreeData {
  let dependencyTreeData = {} as DependencyTreeData;

  let dependencyTreeDataHashTable = [
    { dependencyTree: { ...dependencyTree, nodeID: dependencyTree.fileID }, dependencyTreeData: dependencyTreeData },
  ];
  while (dependencyTreeDataHashTable.length) {
    let {
      dependencyTree,
      dependencyTreeData,
    } = dependencyTreeDataHashTable.pop() as {
      dependencyTree: DependencyTree;
      dependencyTreeData: DependencyTreeData;
    };
    let nodesData = dependencyNodes[dependencyTree.fileID];

    dependencyTreeData.name = dependencyTree.name;
    dependencyTreeData.fileID = dependencyTree.fileID;
    dependencyTreeData.nodeID = dependencyTree.nodeID;
    // dependencyTreeData.parent = dependencyTree.parent;
    if (!nodesData && dependencyTreeData.name === 'circularStructure') {
      nodesData = {
        name: 'circularStructure',
        circularStructure: true,
        type: 'circularStructure',
        fileDescription: {},
        relativePath: "circularStructure"
      } as DependencyNode
    }
    dependencyTreeData.fileDescription = nodesData.fileDescription;
    dependencyTreeData.circularStructure = nodesData.circularStructure;
    dependencyTreeData.type = nodesData.type;
    dependencyTreeData.language = nodesData.language;
    dependencyTreeData.lines = nodesData.lines;
    dependencyTreeData.analyzed = nodesData.analyzed;
    dependencyTreeData.functions = nodesData.functions;
    dependencyTreeData.extension = nodesData.extension;
    dependencyTreeData.absolutePath = dirPath + nodesData.relativePath;
    dependencyTreeData.relativePath = nodesData.relativePath;
    dependencyTreeData.children = [] as DependencyTreeData[];

    for (let i = 0; i < dependencyTree.children.length; i++) {
      let child = {} as DependencyTreeData;
      dependencyTreeData.children.push(child);
      dependencyTreeDataHashTable.push({
        dependencyTree: {
          ...dependencyTree.children[i],
          nodeID: getChildNodeID(dependencyTree.nodeID, dependencyTree.children[i].fileID)
        },
        dependencyTreeData: child,
      });
    }
  }
  return dependencyTreeData;
};
