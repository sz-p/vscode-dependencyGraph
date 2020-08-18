import * as React from 'react';

import { connect } from 'react-redux';

import { statusList } from './statusList';

const statusView = function (props) {
  const { getDataStatus } = props;
  const doms = [];
  if (!getDataStatus) {
    return null
  } else {
    for (let i = 0; i < getDataStatus; i++) {
      doms.push(<div key={statusList[i]} >
        {statusList[i]}
      </div >)
    }
  }
  return doms
}
const mapStateToProps = (state) => {
  return {
    getDataStatus: state.getDataStatus
  }
};
export const StatusView = connect(mapStateToProps)(statusView);
