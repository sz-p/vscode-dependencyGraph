import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { i18n } from "../../../../../i18n/i18n";
import { METHODS_ANALYZED_FAILED } from "../../../../../i18n/types"

const options = {
  selectOnLineNumbers: false,
  lineNumbers: 'off',
  readOnly: true,
  minimap: {
    enabled: false
  },
}
export const FunctionsBox = function (props) {
  const { analysed, functionsList, activeThemeKind, type } = props;
  if (!analysed || !functionsList || !type) {
    return (<div>{i18n.getText(METHODS_ANALYZED_FAILED)}</div>);
  }
  let codeText = '';
  for (let i = 0; i < functionsList.length; i++) {
    const { comment, code } = functionsList[i];
    codeText = codeText + comment + '\n' + code + '\n';
  }
  return (<div className="fileInfoView-functionBox-function"><MonacoEditor
    language={type}
    theme={`vs-${activeThemeKind ? activeThemeKind.toLocaleLowerCase() : 'dark'}`}
    value={codeText}
    options={options}
  /></div>)
}
