import * as React from 'react';
import {
  MessageBar,
  MessageBarType,
  initializeIcons
} from 'office-ui-fabric-react';
import * as STATUS from '../../../../data-dependencyTree/statusType';
import { ErrorDom } from './errorDom';
const StatusDoms = {}
initializeIcons();
// TODO i18n
StatusDoms[STATUS.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER] = {
  "success": [<MessageBar key={STATUS.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER}
    messageBarType={MessageBarType.success}
    isMultiline={false}
  > {STATUS.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER}:获取已打开的文件夹：成功</MessageBar>],
  "error": [<MessageBar key={STATUS.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER}
    messageBarType={MessageBarType.error}
    isMultiline={false}
  > {STATUS.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER}:获取已打开的文件夹：失败</MessageBar>,
  <ErrorDom key={`error_${STATUS.STATUS_GET_DEPENDENCY_DATA_GET_FOLDER}`} />]
}
StatusDoms[STATUS.STATUS_GET_DEPENDENCY_DATA_GET_SAVED_DATA] = {
  "success": [<div></div>],
  "error": [<div></div>]
}
StatusDoms[STATUS.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON] = {
  "success": [<MessageBar key={STATUS.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON}
    messageBarType={MessageBarType.success}
    isMultiline={false}
  > {STATUS.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON}:获取PackageJson文件：成功</MessageBar>],
  "error": [<MessageBar key={STATUS.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON}
    messageBarType={MessageBarType.error}
    isMultiline={false}
  > {STATUS.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON}:获取PackageJson文件：失败</MessageBar>,
  <ErrorDom key={`error_${STATUS.STATUS_GET_DEPENDENCY_DATA_GET_PACKAGE_JSON}`} />]
}
StatusDoms[STATUS.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE] = {
  "success": [<MessageBar key={STATUS.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE}
    messageBarType={MessageBarType.success}
    isMultiline={false}
  > {STATUS.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE}:获取入口文件：成功</MessageBar>],
  "error": [<MessageBar key={STATUS.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE}
    messageBarType={MessageBarType.error}
    isMultiline={false}
  > {STATUS.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE}:获取入口文件：失败</MessageBar>,
  <ErrorDom key={`error_${STATUS.STATUS_GET_DEPENDENCY_DATA_GET_ENTRY_FILE}`} />]
}
StatusDoms[STATUS.STATUS_GET_DEPENDENCY_DATA_GET_DATA] = {
  "success": [<MessageBar key={STATUS.STATUS_GET_DEPENDENCY_DATA_GET_DATA}
    messageBarType={MessageBarType.success}
    isMultiline={false}
  > {STATUS.STATUS_GET_DEPENDENCY_DATA_GET_DATA}:获取依赖树：成功</MessageBar>],
  "error": [<MessageBar key={STATUS.STATUS_GET_DEPENDENCY_DATA_GET_DATA}
    messageBarType={MessageBarType.error}
    isMultiline={false}
  > {STATUS.STATUS_GET_DEPENDENCY_DATA_GET_DATA}:获取依赖树：失败</MessageBar>,
  <ErrorDom key={`error_${STATUS.STATUS_GET_DEPENDENCY_DATA_GET_DATA}`} />]
}
StatusDoms[STATUS.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA] = {
  "success": [<MessageBar key={STATUS.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA}
    messageBarType={MessageBarType.success}
    isMultiline={false}
  > {STATUS.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA}:处理依赖树：成功</MessageBar>],
  "error": [<MessageBar key={STATUS.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA}
    messageBarType={MessageBarType.error}
    isMultiline={false}
  > {STATUS.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA}:处理依赖树：失败</MessageBar>,
  <ErrorDom key={`error_${STATUS.STATUS_GET_DEPENDENCY_DATA_PROCESS_DATA}`} />]
}
export { StatusDoms }
