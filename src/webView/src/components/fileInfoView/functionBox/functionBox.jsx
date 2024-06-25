import * as React from "react";
import { useEffect } from "react";
import MonacoEditor from "react-monaco-editor";
import ReactResizeDetector from "react-resize-detector";
import { i18n } from "../../../../../i18n/i18n";
import { METHODS_ANALYZED_FAILED } from "../../../../../i18n/types";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.js";

const options = {
  selectOnLineNumbers: false,
  lineNumbers: "off",
  readOnly: true,
  folding: false,
  minimap: {
    enabled: false,
  },
};
let monacoEditor = undefined;
export const FunctionsBox = function (props) {
  const { analyzed, functionsList, activeThemeKind, type, language } = props;
  if (!analyzed || !functionsList || !type) {
    return <div>{i18n.getText(METHODS_ANALYZED_FAILED)}</div>;
  }
  let codeText = "";
  for (let i = 0; i < functionsList.length; i++) {
    const { comment, code } = functionsList[i];
    if (comment) {
      codeText = codeText + comment + "\n";
    }
    if (code) {
      codeText = codeText + code + "\n\n";
    }
  }
  const handleEditorDidMount = (editor) => {
    monacoEditor = editor;
  };
  const layoutMonacoEditor = () => {
    if (monacoEditor) {
      monacoEditor.layout();
    }
  };
  return (
    <ReactResizeDetector
      handleWidth={true}
      handleHeight={true}
      onResize={layoutMonacoEditor}
    >
      <div className="fileInfoView-functionBox-function">
        <MonacoEditor
          language={language}
          theme={`vs-${
            activeThemeKind ? activeThemeKind.toLocaleLowerCase() : "dark"
          }`}
          editorDidMount={handleEditorDidMount}
          // monaco's bug string:'' to string:'someCode' all code will be preSelected
          // so use ' ' to replace ''
          value={codeText ? codeText : " "}
          options={options}
        />
      </div>
    </ReactResizeDetector>
  );
};
