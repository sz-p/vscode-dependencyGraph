import * as path from "path";
import * as fs from "fs";
import { cloneDeep } from "lodash";
import { defaultOptions } from "./defaultOptions";
import {
  DependencyTreeOptions,
  Parsers,
  Parser,
  ParseRule,
  DependencyHash,
  DependencyTreeData,
  Alias,
} from "../index.d";
import { parser as tsParser } from "../parsers/generalJsParser/generalJsParser";
import { parser as vueParser } from "../parsers/vueParser/vueParser";
import { pathExists, isDirectory } from "../utils/utils";
export class DependencyTree {
  options: DependencyTreeOptions;
  parsers: Parsers;
  parseRule: ParseRule;
  dependencyHash: DependencyHash;
  dependencyTreeData: DependencyTreeData;
  circularStructureNode: DependencyTreeData;
  static tsParser: Parser;
  static vueParser: Parser;

  constructor(options?: DependencyTreeOptions) {
    options ? (this.options = options) : (this.options = defaultOptions);
    this.parsers = {};
    this.parseRule = {};
    this.dependencyHash = {};
    this.dependencyTreeData = {} as DependencyTreeData;
    this.circularStructureNode = {
      name: "circularStructure",
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
    if (typeof this.options.onGetFileString === "function") {
      this.options.onGetFileString(dependencyNode, absolutePath, codeString);
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
  private triggerGetCircularStructureNode(dependencyNode: DependencyTreeData) {
    if (typeof this.options.onGetCircularStructureNode === "function") {
      this.options.onGetCircularStructureNode(dependencyNode);
    }
  }
  private processAlias(absolutePath: string, alias: Alias): string {
    let _absolutePath = absolutePath;
    for (let key in alias) {
      if (absolutePath.includes(key)) {
        _absolutePath = _absolutePath.replace(key, alias[key]);
        return _absolutePath;
      }
    }
    return _absolutePath;
  }
  private processExt(absolutePath: string, extList: string[]): string {
    for (let i = 0; i < extList.length; i++) {
      const _absolutePath = absolutePath + extList[i];
      if (pathExists(_absolutePath)) {
        return _absolutePath;
      }
    }
    return absolutePath;
  }
  /**
   * webpack get file path with some rules like no ext, no 'node_modules' in here parse these rules
   *
   *
   *
   * @private
   * @param {string} absolutePath
   * @returns {string}
   * @memberof DependencyTree
   */
  private getRealPath(absolutePath: string, folder: string): void {
    // // let _absolutePath = absolutePath;
    // // if path was exited return path
    // if (pathExists(absolutePath)) {
    //   return absolutePath;
    // }
    // // import 'xx' from './dirName' is import 'xx' from './dirName/index'
    // if (isDirectory(absolutePath)) {
    //   _absolutePath = _absolutePath + "/index";
    // }
    // // get ext
    // _absolutePath = this.processExt(absolutePath, resolveExtensions);
    // if (pathExists(_absolutePath)) {
    //   return _absolutePath;
    // }
    // _absolutePath = this.processAlias(absolutePath, alias);
    //   return _absolutePath;
    // else {
    //   return absolutePath;
    // }
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
  registerParser(key: string, parser: Parser) {
    this.parsers[key] = parser;
  }
  registerParseRule(key: string, parser: Parser) {
    this.parseRule[key] = parser;
  }
  removeParser(key: string) {
    delete this.parsers[key];
  }
  removeParseRule(key: string) {
    delete this.parseRule[key];
  }
  setOptions(options: DependencyTreeOptions) {
    if (options) {
      this.options = options;
    }
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

      if (!pathExists(absolutePath)) {
        console.error(`file does not exist: ${absolutePath}`);
        continue;
      }
      this.setDataToDependencyNode(dependencyNode, absolutePath, folderPath);
      const codeString = fs.readFileSync(absolutePath).toString();
      this.triggerGetFileString(dependencyNode, absolutePath, codeString);
      const parser = this.parseRule[dependencyNode.extension];
      if (!parser) {
        console.warn(
          `no ${dependencyNode.extension} parser please register parserRule or parser`
        );
        continue;
      }
      const children = parser(
        dependencyNode,
        absolutePath,
        codeString,
        this.options
      );
      for (let i = 0; i < children.length; i++) {
        const childrenPath = children[i];

        if (!pathExists(childrenPath)) {
          console.error(`file does not exist: ${childrenPath}`);
          continue;
        }

        let dependencyChildren = undefined;
        // old node; node was analysed
        if (this.dependencyHash[childrenPath]) {
          if (this.isCircularStructure(childrenPath, ancestors)) {
            dependencyChildren = this.getCircularStructureNode(
              childrenPath,
              this.dependencyHash
            );
            this.triggerGetCircularStructureNode(dependencyChildren);
          } else {
            dependencyChildren = cloneDeep(this.dependencyHash[childrenPath]);
            this.triggerGetOldDependencyTreeNode(dependencyChildren);
          }
        }
        // find new node
        else {
          const dependencyChildrenAncestors = [].concat(
            ancestors as []
          ) as string[];
          dependencyChildrenAncestors.push(absolutePath);
          dependencyChildren = {
            absolutePath: childrenPath,
            ancestors: dependencyChildrenAncestors as string[],
          } as DependencyTreeData;
          this.triggerGetNewDependencyTreeNode(dependencyChildren);
          dependencyList.push(dependencyChildren);
          this.dependencyHash[
            childrenPath
          ] = dependencyChildren as DependencyTreeData;
        }
        dependencyNode.children.push(dependencyChildren);
      }
    }
    return {
      dependencyTree: this.dependencyTreeData,
      dependencyHash: this.dependencyHash,
    };
  }
}
DependencyTree.tsParser = tsParser;
DependencyTree.vueParser = vueParser;
