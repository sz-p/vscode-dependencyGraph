import * as React from 'react';

import { connect } from 'react-redux';
import "./status.css"
import { loadTheme } from '@fluentui/react';
import { dark, light } from '../../utils/theme'
import { StatusDom } from './statusDom';
import { useEffect, useState } from 'react'
const statusView = function (props) {
  let [doms, setDoms] = useState([]);
  const { getDataStatus, viewHash, gotDependencyTreeData, activeThemeKind } = props;

  useEffect(() => {
    if (viewHash) {
      doms = [], setDoms(doms)
    }
  }, [viewHash])
  useEffect(() => {
    if (activeThemeKind) {
      switch (activeThemeKind) {
        case 'Light':
          loadTheme(light);
          break;
        default:
          loadTheme(dark);
          break;
      }
    }
  }, [activeThemeKind])
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
    gotDependencyTreeData: state.gotDependencyTreeData,
    activeThemeKind: state.activeThemeKind
  }
};
export const StatusView = connect(mapStateToProps)(statusView);
