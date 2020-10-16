import * as babelParser from 'recast/parsers/babel';
import { NodePath } from "ast-types/lib/node-path";
import { namedTypes } from "ast-types/gen/namedTypes";
import { parse, visit } from 'recast';
import * as fs from 'fs';
import { FunctionInformation,Param,FileInformation } from '../../data-dependencyTree/dependencyTreeData';
import {AnalyseData,AnalyseFiled} from './javascriptAnalysis.d';

const getFunctionNameInFunctionDeclaration = function(nodePath:NodePath<namedTypes.Function>):string |undefined {
  const functionName = nodePath?.node?.id?.name;
  if(functionName){
    return functionName
  }else{
    return undefined;
  }
}
const getFunctionNameInVariableDeclarator = function(nodePath:NodePath<namedTypes.VariableDeclarator>):string | undefined {
  const identifier = nodePath?.node?.id as unknown as NodePath<namedTypes.Identifier> | undefined;
  let functionName = undefined;
  if(identifier){
    functionName = identifier.name;
    return functionName
  }else{
    return undefined;
  }
}
const getPathNodes = function(nodePath:NodePath<namedTypes.Function>){
  let FunctionDeclaration = nodePath;
  let ExportNamedDeclaration = undefined;
  let VariableDeclarator = undefined;
  let VariableDeclaration = undefined;
  if(FunctionDeclaration?.parent?.node.type ==='ExportNamedDeclaration'){
    ExportNamedDeclaration = FunctionDeclaration.parent;
  }else if(FunctionDeclaration?.parent?.node.type === 'VariableDeclarator'){
    VariableDeclarator = FunctionDeclaration.parent;
    if(VariableDeclarator.parent?.node.type === 'VariableDeclaration'){
      VariableDeclaration = VariableDeclarator.parent;
      if(VariableDeclaration.parent?.node.type ==='ExportNamedDeclaration'){
        ExportNamedDeclaration = VariableDeclaration.parent;
      }
    }
  }
  return {
    FunctionDeclaration,
    ExportNamedDeclaration,
    VariableDeclarator,
    VariableDeclaration
  }
}
const setArrowFunction = function(FunctionDeclaration:NodePath<namedTypes.Function>,functionInfo:FunctionInformation){
  const arrowFunction = FunctionDeclaration?.node?.type === 'ArrowFunctionExpression'?true:false;
  functionInfo['arrowFunction'] = arrowFunction;
}
const setParams = function(FunctionDeclaration:NodePath<namedTypes.Function>,functionInfo:FunctionInformation){
  const params = FunctionDeclaration?.node?.params||[];
  let functionParams = [] as Param[];

  //TODO params's type
  for(let i=0;i<params.length;i++){
    let param = {} as Param;
    let params_i = params[i];
    if(params_i.type==='Identifier'){
      param.name = params_i.name;
      functionParams.push(param);
    }
  }
  functionInfo['params'] = functionParams;
}

const setComment = function(nodePath:NodePath,functionInfo:FunctionInformation){
  const {leadingComments} = nodePath.node;
  if(leadingComments){
    functionInfo['comment'] = leadingComments[0];
  }
}
const setLoc = function(nodePath:NodePath,functionInfo:FunctionInformation){
  const {loc} = nodePath.node;
  if(loc){
    functionInfo['loc'] = loc;
  }
}
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
  let analysed = undefined;
  const fileInformation = {} as FileInformation;
  const functionsList = [] as FunctionInformation[];
  const codeString = fs.readFileSync(filePath).toString();
  fileInformation.description = getDescription(codeString);
  fileInformation.introduction = getIntroduction(codeString);
  let ast = undefined;
	try {
    ast = babelParser.parse(codeString);
    analysed = true;
	} catch (e) {
    analysed = false;
  }
  if(!ast){
    return  {
      analysed:false,
      fileInformation
    }
  }
	visit(ast, {
		visitFunction(nodePath) {
      const {
        FunctionDeclaration,
        ExportNamedDeclaration,
        VariableDeclarator,
        VariableDeclaration} = getPathNodes(nodePath);

      const functionInfo = {} as FunctionInformation;

      setArrowFunction(FunctionDeclaration,functionInfo)
      setParams(FunctionDeclaration,functionInfo)

      let functionName = undefined;
      functionName = getFunctionNameInFunctionDeclaration(FunctionDeclaration);
      if(functionName){
        functionInfo["name"] = functionName;
        functionInfo["kind"] = 'function';
        if(ExportNamedDeclaration){
          setComment(ExportNamedDeclaration,functionInfo);
          setLoc(ExportNamedDeclaration,functionInfo)
          functionInfo["export"] = true;
        }else{
          setComment(FunctionDeclaration,functionInfo);
          setLoc(FunctionDeclaration,functionInfo)
          functionInfo["export"] = false;
        }
      }else{
        if(VariableDeclarator
          && (functionName = getFunctionNameInVariableDeclarator(VariableDeclarator as NodePath<namedTypes.VariableDeclarator>))){
            functionInfo["name"] = functionName;
            if(VariableDeclaration){
              functionInfo["kind"] = VariableDeclaration.node.kind;
              if(ExportNamedDeclaration){
                setComment(ExportNamedDeclaration,functionInfo);
                setLoc(ExportNamedDeclaration,functionInfo)
                functionInfo["export"] = true;
              }else{
                setComment(VariableDeclaration,functionInfo);
                setLoc(VariableDeclaration,functionInfo)
                functionInfo["export"] = false;
              }
            }
        }
      }
      functionsList.push(functionInfo);
			return false;
    }
  });
  return {functionsList,fileInformation,analysed:true,lines:ast?.loc?.end.line || 0};
};
