import * as path from "path";
import * as fs from "fs";
import { cloneDeep, merge } from "lodash";
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
      ancestors: [] as string[],
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
   * use absolutePath and ancestors find circular structure
   *
   * @param {string} absolutePath
   * @param {string[]} ancestors
   * @returns {boolean}
   */
  private isCircularStructure(
    absolutePath: string,
    ancestors: string[]
  ): boolean {
    for (let i = 0; i < ancestors.length; i++) {
      if (absolutePath === ancestors[i]) {
        return true;
      }
    }
    return false;
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
    let circularStructureNode = cloneDeep(dependencyHash[absolutePath]);
    const circularStructureNodeChild = cloneDeep(this.circularStructureNode);
    circularStructureNodeChild.ancestors = circularStructureNode.ancestors.concat(
      absolutePath
    );
    circularStructureNode.children = [circularStructureNodeChild];
    return circularStructureNode;
  }
  /**
   * reset analysed node ancestor
   *
   * @private
   * @param {string} absolutePath
   * @param {string[]} ancestors
   * @param {DependencyTreeData} dependencyChildren
   * @memberof DependencyTree
   */
  private reSetAnalysedNodesAncestors(
    absolutePath: string,
    ancestors: string[],
    dependencyChildren: DependencyTreeData
  ) {
    let nodeDeep = ancestors.length;
    const dependencyChildrenAncestors = [].concat(ancestors as []) as string[];
    dependencyChildrenAncestors.push(absolutePath);
    dependencyChildren.ancestors = dependencyChildrenAncestors;
    // if node have children reset children's ancestors
    if (dependencyChildren.children) {
      let stack = [].concat(
        dependencyChildren.children as []
      ) as DependencyTreeData[];
      while (stack.length) {
        let node = stack.pop() as DependencyTreeData;
        if (node.name === "circularStructure") {
          node.ancestors.splice(0, nodeDeep, ...dependencyChildrenAncestors, dependencyChildren.absolutePath);
        } else {
          node.ancestors.splice(0, nodeDeep, ...dependencyChildrenAncestors);
        }
        stack = stack.concat(node.children);
      }
    }
  }
  /**
   *
   *
   * @private
   * @param {string} absolutePath
   * @param {string[]} ancestors
   * @param {string} childrenPath
   * @param {DependencyTreeData[]} dependencyList
   * @return {*}  {DependencyTreeData}
   * @memberof DependencyTree
   */
  private getNewNode(absolutePath: string, ancestors: string[], childrenPath: string, dependencyList: DependencyTreeData[]): DependencyTreeData {
    const dependencyChildrenAncestors = [].concat(
      ancestors as []
    ) as string[];
    dependencyChildrenAncestors.push(absolutePath);
    const dependencyChildren = {
      absolutePath: childrenPath,
      ancestors: dependencyChildrenAncestors as string[],
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
      ancestors: [] as string[],
      children: [] as DependencyTreeData[],
    } as DependencyTreeData;

    const dependencyList = [this.dependencyTreeData];
    while (dependencyList.length) {
      const dependencyNode = dependencyList.pop();
      if (!dependencyNode) throw new Error("Error no dependencyNode");

      let { absolutePath, ancestors } = dependencyNode;

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
      const children = parser(
        dependencyNode,
        absolutePath,
        codeString,
        this.options,
        this.parseRule,
        this.parsers
      );
      // if not set dependencyNode in dependencyHash before
      // will not found analysed node
      this.dependencyHash[absolutePath] = dependencyNode;

      for (let i = 0; i < children.length; i++) {
        const childrenPath = children[i];
        if (!isPathExists(childrenPath)) {
          console.error(`file does not exist: ${childrenPath}`);
          continue;
        }

        let dependencyChildren = undefined;
        // old node; node was analysed
        if (this.dependencyHash[childrenPath]) {
          // if (!this.dependencyHash[childrenPath].name) {
          //   // import a file from the same file twice will cloneDeep a not analyzed dependencyChildren
          //   continue;
          // }
          if (this.isCircularStructure(childrenPath, ancestors)) {
            dependencyChildren = this.getCircularStructureNode(
              childrenPath,
              this.dependencyHash
            );
            this.triggerGetCircularStructureNode(
              dependencyChildren,
              this.dependencyHash
            );
          } else {
            dependencyChildren = cloneDeep(this.dependencyHash[childrenPath]);
            this.triggerGetOldDependencyTreeNode(dependencyChildren);
          }
          this.reSetAnalysedNodesAncestors(
            absolutePath,
            ancestors,
            dependencyChildren
          );
          // not analysed
          if (!dependencyChildren.name) {
            dependencyChildren = this.getNewNode(absolutePath, ancestors, childrenPath, dependencyList)
          }
        }
        // find new node
        else {
          dependencyChildren = this.getNewNode(absolutePath, ancestors, childrenPath, dependencyList)
        }
        dependencyNode.children.push(dependencyChildren);
      }
      // cloneDeep
      // this.dependencyHash[absolutePath] = cloneDeep(dependencyNode);
    }
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
