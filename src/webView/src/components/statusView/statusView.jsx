import * as React from 'react';

// import {DarkTheme} from '@fluentui/react';
import { connect } from 'react-redux';
import "./status.css"
import { loadTheme } from '@fluentui/react';
import { dark } from '../../utils/theme'
import { StatusDoms } from './statusDom';
import { useEffect, useState } from 'react'
loadTheme(dark);
const statusView = function (props) {
  let [doms, setDoms] = useState([]);
  const { getDataStatus, viewHash } = props;
  useEffect(() => {
    if (viewHash) {
      doms = [], setDoms(doms)
    }
  }, [viewHash])
  useEffect(() => {
    if (getDataStatus) {
      console.log(getDataStatus);
      console.log(StatusDoms);
      console.log(StatusDoms[getDataStatus.type])
      console.log(getDataStatus.status)
      setDoms(doms.concat(StatusDoms[getDataStatus.type][getDataStatus.status]))
    }
  }, [getDataStatus])

  // if (getDataStatus) {

  //   // setDoms(doms)
  // }
  return (
    <div className="statusView">{doms}</div>
  )
}
const mapStateToProps = (state) => {
  return {
    getDataStatus: state.getDataStatus,
    viewHash: state.viewHash
  }
};
export const StatusView = connect(mapStateToProps)(statusView);
