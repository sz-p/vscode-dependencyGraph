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
import { isPathExists, isDirectory } from "../utils/utils";
export class DependencyTree {
  options: DependencyTreeOptions;
  parsers: Parsers;
  parseRule: ParseRule;
  dependencyHash: DependencyHash;
  dependencyTreeData: DependencyTreeData;
  circularStructureNode: DependencyTreeData;
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
    this.dependencyTreeData = {} as DependencyTreeData;
    this.circularStructureNode = {
      name: "circularStructure",
      fileID: "circularStructure",
      circularStructure: true,
      absolutePath: "circularStructure",
      relativePath: "circularStructure",
      extension: "",
      parent: null,
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
   * use absolutePath and parent find circular structure
   *
   * @param {string} absolutePath
   * @param {DependencyTreeData | null} parent
   * @returns {boolean}
   */
  private isCircularStructure(
    absolutePath: string,
    parent: DependencyTreeData | null
  ): boolean {
    while (parent) {
      if (parent.absolutePath === absolutePath) {
        return true
      }
      parent = parent.parent
    }
    return false
  }
  /**
   * use absolutePath and parent find circular structure on Children
   * @param {DependencyTreeData | null} parent
   */
  private removeRepeatNodeOnTee(dependencyTreeData: DependencyTreeData) {
    const nodeStack = [{ ...dependencyTreeData, deep: 0 }];
    let count = 0;
    let removeCount = 0;
    while (nodeStack.length) {
      count++;
      const node = nodeStack.pop() as DependencyTreeData;
      const { children } = node
      // console.log(`当前树节点数量: ${count} 当前节点深度: ${node.deep} 已移除重复子节点数量: ${removeCount} 剩余待分析节点数量: ${nodeStack.length}`)
      node.children = [];
      if (!children.length) {
        continue
      } else {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (this.isCircularStructure(child.absolutePath, node)) {
            removeCount++;
            const circularStructureNode = this.getCircularStructureNode(
              child.absolutePath,
              this.dependencyHash
            )
            node.children.push({ ...circularStructureNode, deep: (node.deep || 0) + 1 })
          } else {
            const nodeWithDeep = { ...child, deep: (node.deep || 0) + 1 }
            node.children.push(nodeWithDeep);
            if (child.children.length) {
              nodeStack.unshift(nodeWithDeep);
            }
          }
        }
      }
    }
  }
  /**
   * if fended CircularStructure create CircularStructureNode
   *
   * @param {string} absolutePath
   * @param {DependencyHash} dependencyHash
   * @returns {DependencyTreeData}
   */
  private getCircularStructureNode(
    absolutePath: string,
    dependencyHash: DependencyHash
  ): DependencyTreeData {
    const circularStructureNodeChild = { ...this.circularStructureNode };
    //! circularStructureNode id?
    let circularStructureNode = { ...dependencyHash[absolutePath], children: [circularStructureNodeChild] };
    circularStructureNodeChild.parent = circularStructureNode
    return circularStructureNode;
  }
  /**
   * reset analyzed node parent
   *
   * @private
   * @param {string} absolutePath
   * @param { DependencyTreeData | null} parent
   * @param {DependencyTreeData} dependencyChildren
   * @memberof DependencyTree
   */
  private reSetAnalyzedNodesParent(
    absolutePath: string,
    parent: DependencyTreeData | null,
    dependencyChildren: DependencyTreeData
  ) {
    dependencyChildren.parent = parent
  }
  /**
   *
   *
   * @private
   * @param {string} absolutePath
   * @param {DependencyTreeData | null} parent
   * @param {string} childrenPath
   * @param {DependencyTreeData[]} dependencyList
   * @return {*}  {DependencyTreeData}
   * @memberof DependencyTree
   */
  private getNewNode(absolutePath: string, parent: DependencyTreeData | null, childrenPath: string, dependencyList: DependencyTreeData[]): DependencyTreeData {
    const dependencyChildren = {
      absolutePath: childrenPath,
      parent
    } as DependencyTreeData;
    this.triggerGetNewDependencyTreeNode(dependencyChildren);
    dependencyList.push(dependencyChildren);
    this.dependencyHash[
      childrenPath
    ] = dependencyChildren as DependencyTreeData;
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
  parse(entryPath: string, folderPath: string) {
    this.dependencyHash = {};
    this.dependencyTreeData = {
      absolutePath: entryPath,
      parent: null,
      children: [] as DependencyTreeData[],
    } as DependencyTreeData;
    let treeNodeCount = 0;
    const dependencyList = [this.dependencyTreeData];
    while (dependencyList.length) {
      const dependencyNode = dependencyList.pop();
      if (!dependencyNode) throw new Error("Error no dependencyNode");

      let { absolutePath, parent } = dependencyNode;

      if (!isPathExists(absolutePath)) {
        console.error(`file does not exist: ${absolutePath}`);
        continue;
      }
      this.setDataToDependencyNode(dependencyNode, absolutePath, folderPath);
      const codeString = fs.readFileSync(absolutePath).toString();
      this.triggerGetFileString(dependencyNode, absolutePath, codeString);
      const parser = this.parsers[this.parseRule[dependencyNode.extension]];
      if (!parser) {
        console.warn(
          `no ${dependencyNode.extension} parser please register parserRule and parser`
        );
        continue;
      }
      let children = parser(
        dependencyNode,
        absolutePath,
        codeString,
        this.options,
        this.parseRule,
        this.parsers
      );
      // remove repeated child
      if (children.length >= 2) {
        children = Array.from(new Set(children));
      }
      // if not set dependencyNode in dependencyHash before
      // will not found analyzed node
      this.dependencyHash[absolutePath] = dependencyNode;
      for (let i = 0; i < children.length; i++) {
        const childrenPath = children[i];
        if (!isPathExists(childrenPath)) {
          console.error(`file does not exist: ${childrenPath}`);
          continue;
        }

        let dependencyChildren = undefined;
        // old node; node was analyzed
        if (this.dependencyHash[childrenPath]) {
          // if (!this.dependencyHash[childrenPath].name) {
          //   // import a file from the same file twice will cloneDeep a not analyzed dependencyChildren
          //   continue;
          // }
          if (this.isCircularStructure(childrenPath, dependencyNode)) {
            dependencyChildren = this.getCircularStructureNode(
              childrenPath,
              this.dependencyHash
            );
            this.triggerGetCircularStructureNode(
              dependencyChildren,
              this.dependencyHash
            );
          } else {
            dependencyChildren = { ...this.dependencyHash[childrenPath], };
            this.triggerGetOldDependencyTreeNode(dependencyChildren);
          }
          this.reSetAnalyzedNodesParent(
            absolutePath,
            dependencyNode,
            dependencyChildren
          );
          // not analyzed
          if (!dependencyChildren.name) {
            dependencyChildren = this.getNewNode(absolutePath, dependencyNode, childrenPath, dependencyList)
          }
        }
        // find new node
        else {
          dependencyChildren = this.getNewNode(absolutePath, dependencyNode, childrenPath, dependencyList)
        }
        dependencyNode.children.push(dependencyChildren);
        treeNodeCount++;
        // console.log('已分析文件数量：' + Object.keys(this.dependencyHash).length, '依赖树节点：' + treeNodeCount)
      }
      // cloneDeep
      // this.dependencyHash[absolutePath] = cloneDeep(dependencyNode);
    }
    // console.log(`正在移除文件依赖关系中的重复节点`)
    this.removeRepeatNodeOnTee(this.dependencyTreeData);
    return {
      dependencyTree: this.dependencyTreeData,
      dependencyNodes: this.dependencyHash,
    };
  }
}
DependencyTree.jsParser = jsParser;
DependencyTree.vueParser = vueParser;
DependencyTree.tsParser = tsParser;
DependencyTree.cssParser = cssParser;
DependencyTree.noDependenceParser = noDependenceParser;
DependencyTree.generalCssParser = generalCssParser;
DependencyTree.tsxParser = tsxParser;
