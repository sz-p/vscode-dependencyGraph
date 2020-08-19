import * as React from 'react';

import { connect } from 'react-redux';


const settingView = function (props) {
  const { getDataFailed } = props;
  if (!getDataFailed) {
    return null;
  }
  return (<div>settingView</div>)
}
const mapStateToProps = (state) => {
  return {
    getDataFailed: state.getDataFailed
  }
};
export const SettingView = connect(mapStateToProps)(settingView);
