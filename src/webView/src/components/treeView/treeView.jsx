import * as React from 'react';
import { useRef, useEffect } from 'react'
import { connect } from 'react-redux';
import { D3Tree } from './renderTree';
import "./treeView.css"

const tree = new D3Tree();

const treeView = function (props) {
  const { dependencyTreeData, focusOn } = props;
  const chartArea = useRef();
  useEffect(() => { if (dependencyTreeData) { tree.init(chartArea.current, dependencyTreeData); tree.update() } }, [dependencyTreeData])
  useEffect(() => { if (focusOn) tree.openToNode(focusOn.fileData) }, [focusOn])
  return (<div className="treeView" ref={chartArea}></div>)
}
const mapStateToProps = (state) => {
  return {
    dependencyTreeData: state.dependencyTreeData,
    focusOn: state.focusOn
  }
};
export const TreeView = connect(mapStateToProps)(treeView);
