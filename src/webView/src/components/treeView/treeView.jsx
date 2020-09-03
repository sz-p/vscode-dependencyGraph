import * as React from 'react';
import { useRef, useEffect } from 'react'
import { connect } from 'react-redux';
import { D3Tree } from './renderTree';
import "./treeView.css"

const tree = new D3Tree();

const treeView = function (props) {
  const { dependencyTreeData, focusOn, assetsBaseURL } = props;
  const chartArea = useRef();
  useEffect(() => { if (dependencyTreeData && assetsBaseURL) { tree.init(chartArea.current, dependencyTreeData, assetsBaseURL); tree.update() } }, [dependencyTreeData, assetsBaseURL])
  useEffect(() => { if (focusOn) tree.focusOnNode(focusOn.fileData) }, [focusOn])
  return (<div className="treeView" ref={chartArea}></div>)
}
const mapStateToProps = (state) => {
  return {
    dependencyTreeData: state.dependencyTreeData,
    assetsBaseURL: state.assetsBaseURL,
    focusOn: state.focusOn
  }
};
export const TreeView = connect(mapStateToProps)(treeView);
