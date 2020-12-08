export interface DependencyTreeOptions {
  resolveExtensions?: string[];
  alias?: Alias;
  onGetFileString?: (
    dependencyNode: DependencyTreeData,
    absolutePath: string,
    codeString: string
  ) => void;
  onGetNewDependencyTreeNode?: (dependencyNode: DependencyTreeData) => void;
  onGetOldDependencyTreeNode?: (dependencyNode: DependencyTreeData) => void;
  onGetCircularStructureNode?: (
    circularStructureNode: DependencyTreeData
  ) => void;
  onGotAST?: (
    dependencyNode: DependencyTreeData,
    absolutePath: string,
    AST: any
  ) => void;
}
export interface Alias {
  [key: string]: string;
}
export interface Parsers {
  [key: string]: Parser;
}
export interface Parser {
  (
    dependencyNode: DependencyTreeData,
    absolutePath: string,
    codeString: string,
    options: DependencyTreeOptions,
    ParseRule?: ParseRule,
    parsers?: Parsers
  ): string[];
}
export interface ParseRule {
  [key: string]: string;
}
export interface DependencyHash {
  [key: string]: DependencyTreeData;
}
export interface DependencyTreeData {
  name: string;
  extension: string;
  ancestors: string[];
  absolutePath: string;
  relativePath: string;
  circularStructure?: boolean;
  children: Array<DependencyTreeData>;
}
