/**
 * @introduction process dependency tree data
 *
 * @description mini the data size \n change 'DependencyTreeData' to flat { nodes, edges } format
 */
import * as md5 from "md5";
import { DependencyHash } from "@packages/dependency-tree";
import { DependencyTreeData } from "./dependencyTreeData.d";
import { DependencyNode, TransportEdge, TransportsData } from "./dependencyTreeData.d";

const getFileID = function (dependencyTreeData: DependencyTreeData) {
  try {
    return md5(dependencyTreeData.relativePath);
  }
  catch (e) {
    new Error(e)
  }
};
const getChildNodeID = function (parentNodeID: string, fileID: string) {
  return md5(parentNodeID + fileID);
};

export const dependenciesTreeDataToTransportsData = function (
  dependencyTreeData: DependencyTreeData,
  dependencyTreeNodes: DependencyHash,
  dirPath: string
): TransportsData {
  const nodeMap: { [fileID: string]: DependencyNode } = {};
  const fileIDByAbsPath: { [absPath: string]: string } = {};

  for (let key in dependencyTreeNodes) {
    const node = dependencyTreeNodes[key] as DependencyTreeData;
    const fileID = getFileID(node);
    node["fileID"] = fileID;
    fileIDByAbsPath[key] = fileID;
    nodeMap[fileID] = {
      fileID,
      name: node.name,
      circularStructure: node.circularStructure,
      type: node.type,
      extension: node.extension,
      language: node.language,
      lines: node.lines,
      analyzed: node.analyzed,
      relativePath: node.relativePath,
      fileDescription: node.fileDescription,
      functions: node.functions,
      children: node.children.map(child => getFileID(child)),
    };
  }

  const edges: TransportEdge[] = [];
  const seenEdges = new Set<string>();
  for (const absPath in dependencyTreeNodes) {
    const node = dependencyTreeNodes[absPath] as DependencyTreeData;
    const fileID = fileIDByAbsPath[absPath];
    for (const child of node.children) {
      const childFileID = child.absolutePath
        ? (fileIDByAbsPath[child.absolutePath] ?? getFileID(child))
        : getFileID(child);
      if (!childFileID) continue;
      const key = `${fileID}|${childFileID}`;
      if (!seenEdges.has(key)) {
        seenEdges.add(key);
        const importedNames = node.importedNamesByChild?.[child.absolutePath] ?? [];
        edges.push({ source: fileID, target: childFileID, importedNames });
      }
    }
  }

  return {
    nodes: Object.values(nodeMap),
    edges,
    rootId: getFileID(dependencyTreeData),
  };
};

export const transportsDataToDependenciesTreeData = function (
  transportsData: TransportsData,
  dirPath: string
): DependencyTreeData {
  const { nodes, edges, rootId } = transportsData;

  const nodeMap = new Map<string, DependencyNode>();
  for (const node of nodes) nodeMap.set(node.fileID, node);

  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    const list = adjacency.get(edge.source) ?? [];
    list.push(edge.target);
    adjacency.set(edge.source, list);
  }

  const result = {} as DependencyTreeData;

  type QueueItem = {
    fileID: string;
    nodeID: string;
    target: DependencyTreeData;
    ancestors: Set<string>;
  };

  const queue: QueueItem[] = [
    { fileID: rootId, nodeID: rootId, target: result, ancestors: new Set() },
  ];

  while (queue.length) {
    const { fileID, nodeID, target, ancestors } = queue.shift()!;
    let nodeData = nodeMap.get(fileID);

    if (!nodeData) {
      if (target.name === "circularStructure") {
        nodeData = {
          name: "circularStructure",
          fileID: "circularStructure",
          circularStructure: true,
          type: "circularStructure",
          fileDescription: {} as any,
          relativePath: "circularStructure",
          children: [],
          language: undefined as any,
          lines: undefined,
          analyzed: false,
          functions: [],
          extension: "",
        };
      } else {
        continue;
      }
    }

    target.name = nodeData.name;
    target.fileID = fileID;
    target.nodeID = nodeID;
    target.fileDescription = nodeData.fileDescription;
    target.circularStructure = nodeData.circularStructure;
    target.type = nodeData.type;
    target.language = nodeData.language;
    target.lines = nodeData.lines;
    target.analyzed = nodeData.analyzed;
    target.functions = nodeData.functions;
    target.extension = nodeData.extension;
    target.absolutePath = dirPath + nodeData.relativePath;
    target.relativePath = nodeData.relativePath;
    target.children = [];

    if (fileID === "circularStructure") continue;

    const childIDs = adjacency.get(fileID) ?? [];
    const newAncestors = new Set(ancestors).add(fileID);

    for (const childFileID of childIDs) {
      const child = {} as DependencyTreeData;
      target.children.push(child);
      const childNodeID = getChildNodeID(nodeID, childFileID);

      if (ancestors.has(childFileID)) {
        // Cycle detected: reconstruct the circular node with a sentinel child
        const originalNode = nodeMap.get(childFileID)!;
        child.name = originalNode.name;
        child.fileID = childFileID;
        child.nodeID = childNodeID;
        child.fileDescription = originalNode.fileDescription;
        child.circularStructure = true;
        child.type = originalNode.type;
        child.language = originalNode.language;
        child.lines = originalNode.lines;
        child.analyzed = originalNode.analyzed;
        child.functions = originalNode.functions;
        child.extension = originalNode.extension;
        child.absolutePath = dirPath + originalNode.relativePath;
        child.relativePath = originalNode.relativePath;
        child.parents = [];
        child.children = [
          {
            name: "circularStructure",
            fileID: "circularStructure",
            nodeID: getChildNodeID(childNodeID, "circularStructure"),
            circularStructure: true,
            type: "circularStructure",
            fileDescription: {} as any,
            relativePath: "circularStructure",
            absolutePath: "circularStructure",
            parents: [],
            children: [],
            language: undefined as any,
            lines: undefined,
            analyzed: false,
            functions: [],
            extension: "",
            nodeDeep: 0,
          } as DependencyTreeData,
        ];
      } else {
        queue.push({
          fileID: childFileID,
          nodeID: childNodeID,
          target: child,
          ancestors: newAncestors,
        });
      }
    }
  }

  return result;
};
