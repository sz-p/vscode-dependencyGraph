import {
  FunctionInformation,
  FileInformation,
} from "../../data-dependencyTree/dependencyTreeData";
export interface AnalyseData {
  analysed: true;
  lines: number;
  fileInformation: FileInformation;
  functionsList: FunctionInformation[];
}
export interface AnalyseFiled {
  analysed: false;
  fileInformation: FileInformation;
}
