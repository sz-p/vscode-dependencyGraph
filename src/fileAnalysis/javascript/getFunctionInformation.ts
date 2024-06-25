import {
  FunctionInformation,
  Param,
  FileInformation,
} from "../../data-dependencyTree/dependencyTreeData";
import { NodePath } from "ast-types/lib/node-path";
import { ASTNode } from "ast-types/lib/types";
import { namedTypes } from "ast-types/gen/namedTypes";
import { prettyPrint } from "recast";
import * as recast from "recast";
import { cloneDeep } from "lodash";
const getCode = function (ASTNode: ASTNode): string {
  const code = prettyPrint(ASTNode).code;
  return code;
};

const getPathNodes = function (nodePath: NodePath<namedTypes.Function>) {
  let FunctionDeclaration = nodePath;
  let ExportNamedDeclaration = undefined;
  let VariableDeclarator = undefined;
  let VariableDeclaration = undefined;
  let ObjectMethod = undefined;
  let ObjectProperty = undefined;
  if (FunctionDeclaration?.parent?.node.type === "ExportNamedDeclaration") {
    ExportNamedDeclaration = FunctionDeclaration.parent;
  } else if (FunctionDeclaration?.parent?.node.type === "VariableDeclarator") {
    VariableDeclarator = FunctionDeclaration.parent;
    if (VariableDeclarator.parent?.node.type === "VariableDeclaration") {
      VariableDeclaration = VariableDeclarator.parent;
      if (VariableDeclaration.parent?.node.type === "ExportNamedDeclaration") {
        ExportNamedDeclaration = VariableDeclaration.parent;
      }
    }
  } else if (nodePath?.node?.type === "ObjectMethod") {
    ObjectMethod = FunctionDeclaration;
  } else if (nodePath?.node?.type === "ArrowFunctionExpression") {
    if (nodePath?.parent?.node.type === "ObjectProperty") {
      ObjectProperty = nodePath.parent;
    }
  }
  return {
    FunctionDeclaration,
    ExportNamedDeclaration,
    VariableDeclarator,
    VariableDeclaration,
    ObjectMethod,
    ObjectProperty,
  };
};

const setArrowFunction = function (
  FunctionDeclaration: NodePath<namedTypes.Function>,
  functionInfo: FunctionInformation
) {
  const arrowFunction =
    FunctionDeclaration?.node?.type === "ArrowFunctionExpression"
      ? true
      : false;
  functionInfo["arrowFunction"] = arrowFunction;
};
const setParams = function (
  FunctionDeclaration: NodePath<namedTypes.Function>,
  functionInfo: FunctionInformation
) {
  const params = FunctionDeclaration?.node?.params || [];
  let functionParams = [] as Param[];

  //TODO params's type
  for (let i = 0; i < params.length; i++) {
    let param = {} as Param;
    let params_i = params[i];
    if (params_i.type === "Identifier") {
      param.name = params_i.name;
      functionParams.push(param);
    }
  }
  functionInfo["params"] = functionParams;
};

const getFunctionNameInFunctionDeclaration = function (
  nodePath: NodePath<namedTypes.Function>
): string | undefined {
  const functionName = nodePath?.node?.id?.name;
  if (functionName) {
    return functionName;
  } else {
    return undefined;
  }
};
const getFunctionNameInVariableDeclarator = function (
  nodePath: NodePath<namedTypes.VariableDeclarator>
): string | undefined {
  const identifier = (nodePath?.node?.id as unknown) as
    | NodePath<namedTypes.Identifier>
    | undefined;
  let functionName = undefined;
  if (identifier) {
    functionName = identifier.name;
    return functionName;
  } else {
    return undefined;
  }
};
const getFunctionNameInObject = function (
  nodePath: NodePath<namedTypes.ObjectMethod>
): string | undefined {
  const identifier = (nodePath?.node?.key as unknown) as
    | NodePath<namedTypes.Identifier>
    | undefined;
  let functionName = undefined;
  if (identifier) {
    functionName = identifier.name;
    return functionName;
  } else {
    return undefined;
  }
};

const setComment = function (
  nodePath: NodePath,
  functionInfo: FunctionInformation
) {
  const { leadingComments } = nodePath.node;
  if (leadingComments) {
    functionInfo["comment"] = leadingComments[leadingComments.length - 1].value;
    functionInfo["comment"] = "/*" + functionInfo["comment"] + "*/";
  }
};
const setLoc = function (
  nodePath: NodePath,
  functionInfo: FunctionInformation
) {
  const { loc } = nodePath.node;
  if (loc) {
    functionInfo["loc"] = loc;
  }
};

const getFunctionInformationFunctionDeclaration = function (
  functionInfo: FunctionInformation,
  functionName: string,
  FunctionDeclaration: NodePath<namedTypes.Function>,
  ExportNamedDeclaration:
    | NodePath<namedTypes.ExportNamedDeclaration>
    | undefined
): void {
  functionInfo["name"] = functionName;
  functionInfo["kind"] = "function";
  if (ExportNamedDeclaration) {
    setComment(ExportNamedDeclaration, functionInfo);
    setLoc(ExportNamedDeclaration, functionInfo);
    functionInfo["export"] = true;
    functionInfo["code"] = getCode(ExportNamedDeclaration.node);
  } else {
    setComment(FunctionDeclaration, functionInfo);
    setLoc(FunctionDeclaration, functionInfo);
    functionInfo["export"] = false;
    functionInfo["code"] = getCode(FunctionDeclaration.node);
  }
};
const getFunctionInVariableDeclarator = function (
  functionInfo: FunctionInformation,
  functionName: string,
  VariableDeclaration: NodePath<namedTypes.VariableDeclaration> | undefined,
  ExportNamedDeclaration:
    | NodePath<namedTypes.ExportNamedDeclaration>
    | undefined
) {
  functionInfo["name"] = functionName;
  if (VariableDeclaration) {
    functionInfo["kind"] = VariableDeclaration.node.kind;
    if (ExportNamedDeclaration) {
      setComment(ExportNamedDeclaration, functionInfo);
      setLoc(ExportNamedDeclaration, functionInfo);
      functionInfo["code"] = getCode(ExportNamedDeclaration.node);
      functionInfo["export"] = true;
    } else {
      setComment(VariableDeclaration, functionInfo);
      setLoc(VariableDeclaration, functionInfo);
      functionInfo["code"] = getCode(VariableDeclaration.node);
      functionInfo["export"] = false;
    }
  }
};
const getFunctionInObject = function (
  functionInfo: FunctionInformation,
  functionName: string,
  ObjectMethod: NodePath<namedTypes.ObjectMethod>
) {
  functionInfo["name"] = functionName;
  // true is ObjectMethod temporary is function
  functionInfo["kind"] = "function";
  functionInfo["export"] = false;
  functionInfo["code"] = getCode(ObjectMethod.node);
  setLoc(ObjectMethod, functionInfo);
  setComment(ObjectMethod, functionInfo);
};
const removeBody = function (nodePath: NodePath<namedTypes.Function>) {
  if (nodePath?.node?.body?.type === "BlockStatement") {
    const builder = recast.types.builders;
    const emptyBlockStatement = builder.blockStatement([]);
    nodePath.node.body = emptyBlockStatement;
  }
};
export const getFunctionInformation = function (
  nodePath: NodePath<namedTypes.Function>
): FunctionInformation {
  const functionInfo = {} as FunctionInformation;
  //! fix this
  nodePath = cloneDeep(nodePath)
  const {
    FunctionDeclaration,
    ExportNamedDeclaration,
    VariableDeclarator,
    VariableDeclaration,
    ObjectMethod,
    ObjectProperty,
  } = getPathNodes(nodePath);

  removeBody(FunctionDeclaration);
  setArrowFunction(FunctionDeclaration, functionInfo);
  setParams(FunctionDeclaration, functionInfo);
  let functionName = undefined;
  functionName = getFunctionNameInFunctionDeclaration(FunctionDeclaration);

  if (functionName) {
    getFunctionInformationFunctionDeclaration(
      functionInfo,
      functionName,
      FunctionDeclaration,
      ExportNamedDeclaration
    );
  } else if (
    VariableDeclarator &&
    (functionName = getFunctionNameInVariableDeclarator(
      VariableDeclarator as NodePath<namedTypes.VariableDeclarator>
    ))
  ) {
    getFunctionInVariableDeclarator(
      functionInfo,
      functionName,
      VariableDeclaration,
      ExportNamedDeclaration
    );
  } else if (
    ObjectProperty &&
    (functionName = getFunctionNameInObject(
      ObjectProperty as NodePath<namedTypes.ObjectMethod>
    ))
  ) {
    getFunctionInObject(
      functionInfo,
      functionName,
      ObjectProperty as NodePath<namedTypes.ObjectMethod>
    );
  } else if (
    ObjectMethod &&
    (functionName = getFunctionNameInObject(
      ObjectMethod as NodePath<namedTypes.ObjectMethod>
    ))
  ) {
    getFunctionInObject(
      functionInfo,
      functionName,
      ObjectMethod as NodePath<namedTypes.ObjectMethod>
    );
  }
  return functionInfo;
};
