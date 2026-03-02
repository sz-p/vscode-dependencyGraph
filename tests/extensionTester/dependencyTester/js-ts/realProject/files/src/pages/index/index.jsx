import React, { useState } from 'react';
import styles from "./index.scss";
import { Link } from 'react-router-dom';
import Force2D from "../../components/force-2d/force-2d";
import Force3D from "../../components/force-3d/force-3d";

import { connect } from 'react-redux';

function IndexPage(props) {
  console.log(props);
  return (
    <div className={styles.page}>
      {props.dimension === '2D' ? <Force2D /> : null}
      {props.dimension === '3D' ? <Force3D /> : null}
    </div>
  );
}
const mapStateToProps = (state) => {
  if (state) {
    return {
      dimension: state.dimension
    };
  } else {
    return {}
  }
};

export default connect(mapStateToProps)(IndexPage);
