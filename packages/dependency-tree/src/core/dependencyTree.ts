import * as path from "path";
import * as fs from "fs";
import { merge } from "lodash";
import { defaultOptions } from "./defaultOptions";
import {
  DependencyTreeOptions,
  Parsers,
  Parser,
  ParseRule,
  DependencyHash,
  DependencyTreeData,
} from "../index.d";
import { parser as jsParser } from "../parsers/jsParser/jsParser";
import { parser as vueParser } from "../parsers/vueParser/vueParser";
import { parser as tsParser } from "../parsers/tsParser/tsParser";
import { parser as tsxParser } from "../parsers/tsxParser/tsxParser";
import { parser as cssParser } from "../parsers/cssParser/cssParser";
import { parser as noDependenceParser } from "../parsers/noDependenceParser/noDependenceParser";
import { parser as generalCssParser } from "../parsers/generalCssParser/generalCssParser";
import { isPathExists } from "../utils/utils";
export class DependencyTree {
  options: DependencyTreeOptions;
  parsers: Parsers;
  parseRule: ParseRule;
  dependencyHash: DependencyHash;
  dependencyTreeData: DependencyTreeData;
  circularStructureNode: DependencyTreeData;
  visited: Map<string, DependencyTreeData>;
  static jsParser: Parser;
  static generalCssParser: Parser;
  static vueParser: Parser;
  static noDependenceParser: Parser;
  static cssParser: Parser;
  static tsParser: Parser;
  static tsxParser: Parser;
  constructor(options?: DependencyTreeOptions) {
    this.options = defaultOptions;
    if (options) merge(this.options, options);
    this.parsers = {};
    this.parseRule = {};
    this.dependencyHash = {};
    this.visited = new Map();
    this.dependencyTreeData = {} as DependencyTreeData;
    this.circularStructureNode = {
      name: "circularStructure",
      fileID: "circularStructure",
      circularStructure: true,
      absolutePath: "circularStructure",
      relativePath: "circularStructure",
      extension: "",
      parents: [],
      children: [],
    };
  }
  private setDataToDependencyNode(
    dependencyNode: DependencyTreeData,
    absolutePath: string,
    folderPath: string
  ) {
    const extname = path.extname(absolutePath);
    const baseName = path.basename(absolutePath);
    const relativePath = absolutePath.replace(folderPath, "");
    dependencyNode.extension = extname;
    dependencyNode.name = baseName;
    dependencyNode.relativePath = relativePath;
    dependencyNode.children = [];
  }
  private triggerGetFileString(
    dependencyNode: DependencyTreeData,
    absolutePath: string,
    codeString: string
  ) {
    if (typeof this.options.onGotFileString === "function") {
      this.options.onGotFileString(dependencyNode, absolutePath, codeString);
    }
  }
  private triggerGetNewDependencyTreeNode(dependencyNode: DependencyTreeData) {
    if (typeof this.options.onGetNewDependencyTreeNode === "function") {
      this.options.onGetNewDependencyTreeNode(dependencyNode);
    }
  }
  private triggerGetOldDependencyTreeNode(dependencyNode: DependencyTreeData) {
    if (typeof this.options.onGetOldDependencyTreeNode === "function") {
      this.options.onGetOldDependencyTreeNode(dependencyNode);
    }
  }
  private triggerGetCircularStructureNode(
    dependencyNode: DependencyTreeData,
    dependencyHash: DependencyHash
  ) {
    if (typeof this.options.onGotCircularStructureNode === "function") {
      this.options.onGotCircularStructureNode(dependencyNode, dependencyHash);
    }
  }
  /**
   * True cycle: absolutePath is an ancestor of current in the DFS construction tree.
   * Uses parents[0] as the DFS parent (first/construction parent of each node).
   */
  private isCircularStructure(
    absolutePath: string,
    current: DependencyTreeData | null
  ): boolean {
    while (current) {
      if (current.absolutePath === absolutePath) return true;
      current = current.parents[0] ?? null;
    }
    return false;
  }
  /**
   * if found CircularStructure create CircularStructureNode
   */
  private getCircularStructureNode(
    absolutePath: string,
    dependencyHash: DependencyHash
  ): DependencyTreeData {
    const circularStructureNodeChild = { ...this.circularStructureNode };
    const circularStructureNode = { ...dependencyHash[absolutePath], children: [circularStructureNodeChild] };
    circularStructureNodeChild.parents = [circularStructureNode];
    return circularStructureNode;
  }
  private getNewNode(parent: DependencyTreeData | null, childrenPath: string, dependencyList: DependencyTreeData[]): DependencyTreeData {
    const dependencyChildren = {
      absolutePath: childrenPath,
      parents: parent ? [parent] : [],
    } as DependencyTreeData;
    this.triggerGetNewDependencyTreeNode(dependencyChildren);
    dependencyList.push(dependencyChildren);
    this.dependencyHash[childrenPath] = dependencyChildren;
    return dependencyChildren;
  }

  registerParser(key: string, parser: Parser) {
    this.parsers[key] = parser;
  }
  registerParseRule(key: string, parserKey: string) {
    this.parseRule[key] = parserKey;
  }
  removeParser(key: string) {
    delete this.parsers[key];
  }
  removeParseRule(key: string) {
    delete this.parseRule[key];
  }
  setOptions(options: DependencyTreeOptions) {
    if (options) merge(this.options, options);
  }

  /**
   * Initialize parsing state
   */
  private initializeParseState(entryPath: string) {
    this.dependencyHash = {};
    this.visited = new Map();
    this.dependencyTreeData = {
      absolutePath: entryPath,
      parents: [] as DependencyTreeData[],
      children: [] as DependencyTreeData[],
    } as unknown as DependencyTreeData;
  }

  /**
   * Process a single dependency node
   */
  private processDependencyNode(
    dependencyNode: DependencyTreeData,
    folderPath: string,
    dependencyList: DependencyTreeData[],
    treeNodeCount: { value: number }
  ) {
    let { absolutePath } = dependencyNode;

    if (!isPathExists(absolutePath)) {
      console.error(`file does not exist: ${absolutePath}`);
      return;
    }

    this.setDataToDependencyNode(dependencyNode, absolutePath, folderPath);
    const codeString = fs.readFileSync(absolutePath).toString();
    this.triggerGetFileString(dependencyNode, absolutePath, codeString);

    const parser = this.parsers[this.parseRule[dependencyNode.extension]];
    if (!parser) {
      console.warn(
        `no ${dependencyNode.extension} parser please register parserRule and parser`
      );
      this.visited.set(absolutePath, dependencyNode);
      return;
    }

    let children = parser(
      dependencyNode,
      absolutePath,
      codeString,
      this.options,
      this.parseRule,
      this.parsers
    );

    if (children.length >= 2) {
      children = Array.from(new Set(children));
    }

    this.dependencyHash[absolutePath] = dependencyNode;

    for (let i = 0; i < children.length; i++) {
      const childrenPath = children[i];
      this.processChildDependency(
        childrenPath,
        dependencyNode,
        dependencyList,
        treeNodeCount
      );
    }

    this.visited.set(absolutePath, dependencyNode);
  }

  /**
   * Process a child dependency path
   */
  private processChildDependency(
    childrenPath: string,
    parentNode: DependencyTreeData,
    dependencyList: DependencyTreeData[],
    treeNodeCount: { value: number }
  ) {
    if (!isPathExists(childrenPath)) {
      console.error(`file does not exist: ${childrenPath}`);
      return;
    }

    let dependencyChildren: DependencyTreeData;

    if (this.dependencyHash[childrenPath]) {
      if (this.isCircularStructure(childrenPath, parentNode)) {
        // True cycle: childrenPath is an ancestor of parentNode in the DFS tree
        dependencyChildren = this.getCircularStructureNode(childrenPath, this.dependencyHash);
        dependencyChildren.parents = [parentNode];
        this.triggerGetCircularStructureNode(dependencyChildren, this.dependencyHash);
      } else if (this.visited.has(childrenPath)) {
        // Already fully processed: reuse the node, register the new parent
        dependencyChildren = this.visited.get(childrenPath)!;
        dependencyChildren.parents.push(parentNode);
        this.triggerGetOldDependencyTreeNode(dependencyChildren);
      } else {
        // Queued from another branch but not yet processed: reuse the node, register new parent
        dependencyChildren = this.dependencyHash[childrenPath];
        dependencyChildren.parents.push(parentNode);
        this.triggerGetOldDependencyTreeNode(dependencyChildren);
      }
    } else {
      // New node: create and queue for processing
      dependencyChildren = this.getNewNode(parentNode, childrenPath, dependencyList);
    }

    parentNode.children.push(dependencyChildren);
    treeNodeCount.value++;
  }

  /**
   * Finalize parse and return result
   */
  private finalizeParse() {
    return {
      dependencyTree: this.dependencyTreeData,
      dependencyNodes: this.dependencyHash,
    };
  }

  parse(entryPath: string, folderPath: string) {
    this.initializeParseState(entryPath);

    let treeNodeCount = { value: 0 };
    const dependencyList = [this.dependencyTreeData];

    while (dependencyList.length) {
      const dependencyNode = dependencyList.pop();
      if (!dependencyNode) throw new Error("Error no dependencyNode");

      this.processDependencyNode(dependencyNode, folderPath, dependencyList, treeNodeCount);
    }

    return this.finalizeParse();
  }
}
DependencyTree.jsParser = jsParser;
DependencyTree.vueParser = vueParser;
DependencyTree.tsParser = tsParser;
DependencyTree.cssParser = cssParser;
DependencyTree.noDependenceParser = noDependenceParser;
DependencyTree.generalCssParser = generalCssParser;
DependencyTree.tsxParser = tsxParser;
