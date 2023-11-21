export interface DependencyTreeOptions {
  resolveExtensions?: string[];
  alias?: Alias;
  onGotFileString?: (
    dependencyNode: DependencyTreeData,
    absolutePath: string,
    codeString: string
  ) => void;
  onGetNewDependencyTreeNode?: (dependencyNode: DependencyTreeData) => void;
  onGetOldDependencyTreeNode?: (dependencyNode: DependencyTreeData) => void;
  onGotCircularStructureNode?: (
    circularStructureNode: DependencyTreeData,
    dependencyHash: DependencyHash
  ) => void;
  onGotAST?: (
    dependencyNode: DependencyTreeData,
    absolutePath: string,
    AST: any
  ) => void;
}
export interface Alias {
  [key: string]: string | Array<string>;
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
// TODO ParseRule should be like webpack config
export interface ParseRule {
  [key: string]: string;
}

export interface FileData {
  fileID: string;
  name: string;
  extension: string;
  absolutePath: string;
  relativePath: string;
  children: Array<FileData>;
  fathers?: Array<FileData>;
  circularStructure?: boolean;
}

export interface DependencyHash {
  [key: string]: FileData;
}
export interface DependencyTreeData {
  fileID:string;
  ancestors: string[];
}
