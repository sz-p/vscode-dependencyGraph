import React, { useState, useEffect } from 'react';
import * as dat from "dat.gui"
import { connect } from 'react-redux'
import { store } from "../../App";
import { change_data, change_dimension } from "../../actions/action";

function Controller() {
  const state = {
    data: "足球俱乐部",
    dimension: "2D"
  }

  useEffect(() => {
    var gui = new dat.GUI({ autoPlace: false });
    document.getElementById('root').appendChild(gui.domElement);
    gui.add(state, 'dimension', ["2D", "3D"]).name("维度").onChange((value => {
      store.dispatch(change_dimension(value))
    }));
    gui.add(state, 'data', ["足球俱乐部", "跆拳道俱乐部", '力学图引用']).name("数据集").onChange((value => {
      store.dispatch(change_data(value))
    }));
  })
  return (
    <div>
    </div>
  );
}


export default Controller;
