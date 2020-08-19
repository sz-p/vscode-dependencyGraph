import * as React from 'react';
import { useRef, useEffect } from 'react'
import { connect } from 'react-redux';
import { renderTree } from './renderTree';
import "./treeView.css"
const treeView = function (props) {
  const { dependencyTreeData } = props;
  const chartArea = useRef();
  useEffect(() => { if (dependencyTreeData) renderTree(chartArea.current, dependencyTreeData) }, [dependencyTreeData, chartArea.current])
  return (<div className="treeView" ref={chartArea}></div>)
}
const mapStateToProps = (state) => {
  return {
    dependencyTreeData: state.dependencyTreeData
  }
};
export const TreeView = connect(mapStateToProps)(treeView);
