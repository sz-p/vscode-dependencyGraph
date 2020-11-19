import { namedTypes } from "ast-types/gen/namedTypes";
export interface FileInformation {
  introduction?: string;
  description?: string;
}
export interface Param {
  name: string;
  type?: string;
}
export interface FunctionInformation {
  comment?: string;
  export: boolean;
  code: string;
  loc: namedTypes.SourceLocation | null | undefined;
  params: Param[] | [];
  arrowFunction: boolean;
  kind: "const" | "let" | "function" | "var";
  name: string;
}
export interface DependencyTreeData {
  name: string;
  fileDescription: FileInformation;
  circularStructure?: true;
  type: string;
  lines: number | undefined;
  analysed: boolean;
  functions: FunctionInformation[] | [];
  extension: string;
  absolutePath: string;
  relativePath: string;
  ancestors: string[];
  children: Array<DependencyTreeData>;
}
