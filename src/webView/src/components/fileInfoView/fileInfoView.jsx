import * as React from 'react';
import { useEffect } from 'react'

import { connect } from 'react-redux';


const fileInfoView = function (props) {
  const { selectedNode } = props;
  useEffect(() => { if (selectedNode) window.console.log(selectedNode) }, [selectedNode])
  return (<div>fileInfoView</div>)
}
const mapStateToProps = (state) => {
  return {
    selectedNode: state.selectedNode
  }
};
export const FileInfoView = connect(mapStateToProps)(fileInfoView);
