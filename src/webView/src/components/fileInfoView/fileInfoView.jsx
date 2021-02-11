import * as React from "react";
import "./fileInfoView.css";
import { FunctionsBox } from "./functionBox/functionBox";
import { ResizeBar } from "./resizeBar/resizeBar";
import { useRef } from "react";
import { connect } from "react-redux";
import { i18n } from "../../../../i18n/i18n";
import {
  FILE_LINES,
  FILE_TYPE,
  INTRODUCTION,
  DESCRIPTION,
  METHODS,
} from "../../../../i18n/types";
import { msgOpenFileInView } from "../../utils/messages";

let boxWidth = 297;
const fileInfoView = function (props) {
  const dom = useRef();
  const { selectedNode, assetsBaseURL, activeThemeKind } = props;
  const resizeBox = function (dx) {
    dom.current.style.transition = "auto";
    dom.current.style.width = boxWidth + dx + "px";
  };
  const resizeEnd = function (dx) {
    dom.current.style.transition = "all 0.3s";
    boxWidth = boxWidth + dx;
  };
  let className = "fileInfoView hidden-right";
  if (!selectedNode || !assetsBaseURL) {
    return <div className={className}></div>;
  }
  className = "fileInfoView";
  const {
    name,
    analysed,
    type,
    lines,
    fileDescription,
    functions,
  } = selectedNode;
  let { introduction, description } = fileDescription;
  introduction ? (introduction = introduction.replace(/\\n/g, "</br>")) : null;
  description ? (description = description.replace(/\\n/g, "</br>")) : null;
  return (
    <div ref={dom} className={className}>
      <ResizeBar onResize={resizeBox} onResizeEnd={resizeEnd} />
      <div className="fileInfoView-titleBar">
        <div className="fileInfoView-titleBar-titleLabel">{name}</div>
        <div
          style={{
            background: `url(${assetsBaseURL}/webview/edit-${activeThemeKind ? activeThemeKind.toLocaleLowerCase() : "dark"
              }.svg) center center / contain no-repeat`,
          }}
          onClick={() => {
            msgOpenFileInView(selectedNode.absolutePath).post();
          }}
          className="fileInfoView-titleBar-titleButton"
        ></div>
      </div>
      <div className="fileInfoView-type">
        <div className="fileInfoView-type-type">
          {i18n.getText(FILE_TYPE)}:{" "}
          <span className="fileTypeText">{type}</span>
        </div>
        <div className="fileInfoView-type-line">
          {i18n.getText(FILE_LINES)}:{" "}
          <span className="fileLineText">{lines}</span>
        </div>
      </div>
      <div className="fileInfoView-fileDescription">
        <div className="fileInfoView-fileDescription-title">
          {i18n.getText(INTRODUCTION)}:
        </div>
        <div
          className="fileInfoView-fileDescription-view"
          dangerouslySetInnerHTML={{ __html: introduction }}
        ></div>
        <div className="fileInfoView-fileDescription-title">
          {i18n.getText(DESCRIPTION)}:
        </div>
        <div
          className="fileInfoView-fileDescription-view"
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
      </div>
      <div className="fileInfoView-functionBox">
        <div className="fileInfoView-functionBox-title">
          {i18n.getText(METHODS)}:
        </div>
        <FunctionsBox
          analysed={analysed}
          type={type}
          activeThemeKind={activeThemeKind}
          functionsList={functions}
        />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    selectedNode: state.selectedNode,
    assetsBaseURL: state.assetsBaseURL,
    activeThemeKind: state.activeThemeKind,
  };
};
export const FileInfoView = connect(mapStateToProps)(fileInfoView);
