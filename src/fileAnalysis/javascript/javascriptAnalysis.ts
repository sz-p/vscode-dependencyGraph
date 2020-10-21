import * as babelParser from 'recast/parsers/babel';
import { parse, visit } from 'recast';
import * as fs from 'fs';
import { FunctionInformation,Param,FileInformation } from '../../data-dependencyTree/dependencyTreeData';
import {AnalyseData,AnalyseFiled} from './javascriptAnalysis.d';

import {getFunctionInformation} from './getFunctionInformation';

const getIntroduction = function(codeString:string){
  const reg = /@introduction (.*)\n/
  const result = codeString.match(reg);
  if(result){
    return result[1].replace('\r','')
  }else{
    return undefined
  }
}
const getDescription = function(codeString:string){
  const reg = /@description (.*)\n/
  const result = codeString.match(reg);
  if(result){
    return result[1].replace('\r','')
  }else{
    return undefined
  }
}
export const analysesFile = function(filePath: string) :AnalyseData |AnalyseFiled{
  const fileInformation = {} as FileInformation;
  const functionsList = [] as FunctionInformation[];
  const codeString = fs.readFileSync(filePath).toString();
  fileInformation.description = getDescription(codeString);
  fileInformation.introduction = getIntroduction(codeString);
  let ast = undefined;
	try {
    ast = babelParser.parse(codeString);
	} catch (e) {
    //TODO catch error
  }
  if(!ast){
    return  {
      analysed:false,
      fileInformation
    }
  }
	visit(ast, {
		visitFunction(nodePath) {
      const functionInfo = getFunctionInformation(nodePath) ;
      functionsList.push(functionInfo);
			return false;
    }
  });
  return {functionsList,fileInformation,analysed:true,lines:ast?.loc?.end.line || 0};
};
