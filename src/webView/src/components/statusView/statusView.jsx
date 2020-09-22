import * as React from 'react';

import { connect } from 'react-redux';
import "./status.css"
import { loadTheme } from '@fluentui/react';
import { dark } from '../../utils/theme'
import { StatusDom } from './statusDom';
import { useEffect, useState } from 'react'
loadTheme(dark);
const statusView = function (props) {
  let [doms, setDoms] = useState([]);
  const { getDataStatus, viewHash, gotDependencyTreeData } = props;

  useEffect(() => {
    if (viewHash) {
      doms = [], setDoms(doms)
    }
  }, [viewHash])
  useEffect(() => {
    if (getDataStatus) {
      setDoms(doms.concat(<StatusDom type={getDataStatus.type} status={getDataStatus.status} />))
    }
  }, [getDataStatus])
  if (gotDependencyTreeData) return null
  return (
    <div className="statusView">{doms}</div>
  )
}
const mapStateToProps = (state) => {
  return {
    getDataStatus: state.getDataStatus,
    viewHash: state.viewHash,
    gotDependencyTreeData: state.gotDependencyTreeData
  }
};
export const StatusView = connect(mapStateToProps)(statusView);
