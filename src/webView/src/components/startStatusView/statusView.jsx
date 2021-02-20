import * as React from "react";

import { connect } from "react-redux";
import "./status.css";
import { loadTheme } from "@fluentui/react";
import { dark, light } from "../../utils/theme";
import { StatusDom } from "./statusDom";
import { useEffect, useState } from "react";
import { WaitingView } from "../waitingView/waitingView";
const statusView = function (props) {
  let [doms, setDoms] = useState([<WaitingView key="WaitingView" />]);
  let [error, setError] = useState(false);
  const {
    getDataStatus,
    viewHash,
    gotDependencyTreeData,
    activeThemeKind,
  } = props;

  useEffect(() => {
    if (viewHash) {
      doms = [<WaitingView key="WaitingView" />];
      setDoms(doms);
    }
  }, [viewHash]);
  useEffect(() => {
    if (activeThemeKind) {
      switch (activeThemeKind) {
        case "Light":
          loadTheme(light);
          break;
        default:
          loadTheme(dark);
          break;
      }
    }
  }, [activeThemeKind]);
  useEffect(() => {
    if (getDataStatus && !error) {
      doms.pop();
      doms = doms.concat(
        <StatusDom
          key={getDataStatus.type}
          type={getDataStatus.type}
          status={getDataStatus.status}
        />
      );
      doms.push(<WaitingView key="WaitingView" />);
      if (getDataStatus.status === "error") {
        setError(true);
        doms.pop();
      }
      setDoms(doms);
    }
  }, [getDataStatus]);
  if (gotDependencyTreeData) return null;
  return <div className="statusView">{doms}</div>;
};
const mapStateToProps = (state) => {
  return {
    getDataStatus: state.getDataStatus,
    viewHash: state.viewHash,
    gotDependencyTreeData: state.gotDependencyTreeData,
    activeThemeKind: state.activeThemeKind,
  };
};
export const StatusView = connect(mapStateToProps)(statusView);
