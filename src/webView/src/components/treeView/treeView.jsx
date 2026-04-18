import * as React from "react";
import { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { D3Tree } from "./renderTree";
import { throttle } from "../../utils/utils";
import "./treeView.css";

const tree = new D3Tree();
const focusOnNode = throttle(tree.focusOnNode.bind(tree), tree.DURATION_TIME);

const treeView = function (props) {
  const {
    dependencyTreeData,
    focusOn,
    assetsBaseURL,
    gotDependencyTreeData,
    activeThemeKind,
    layout,
  } = props;
  const chartArea = useRef();
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      tree.resize();
    });
    if (dependencyTreeData && assetsBaseURL) {
      tree.init(
        chartArea.current,
        dependencyTreeData,
        assetsBaseURL,
        activeThemeKind
      );
      tree.update();
      observer.observe(chartArea.current);
    }
    return () => {
      observer.unobserve(chartArea.current);
    };
  }, [dependencyTreeData, assetsBaseURL]);
  useEffect(() => {
    if (focusOn) focusOnNode(focusOn.ancestors);
    console.log(focusOn);
  }, [focusOn]);
  useEffect(() => {
    if (layout) tree.setLayout(layout);
  }, [layout]);
  const viewStatus = gotDependencyTreeData ? "treeView" : "treeView hidden";
  return <div className={viewStatus} ref={chartArea}></div>;
};
const mapStateToProps = (state) => {
  return {
    dependencyTreeData: state.dependencyTreeData,
    activeThemeKind: state.activeThemeKind,
    assetsBaseURL: state.assetsBaseURL,
    focusOn: state.focusOn,
    gotDependencyTreeData: state.gotDependencyTreeData,
    layout: state.layout,
  };
};
export const TreeView = connect(mapStateToProps)(treeView);
