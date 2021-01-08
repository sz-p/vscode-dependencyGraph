import * as React from "react";

import { connect } from "react-redux";
import "./settingView.css";
import { FontIcon } from "office-ui-fabric-react/lib/Icon";
import { action_changeSettingStatus } from "../../actions/action";
import { store } from "../../reducers/store";
import { FolderAndEntry } from "./folderAndEntrySetting";
import { ResolveSetting } from "./resolveSetting";
import { AliasSetting } from "./aliasSetting";

const settingView = function (props) {
  const { showSetting } = props;
  return (
    <div
      className="settingViewMask"
      style={{ display: showSetting ? "block" : "none" }}
    >
      <div className="settingView">
        <FontIcon
          iconName="ChromeClose"
          className="closeButton"
          onClick={() => {
            store.dispatch(action_changeSettingStatus());
          }}
        />
        <FolderAndEntry />
        <ResolveSetting />
        <AliasSetting />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    showSetting: state.showSetting,
  };
};
export const SettingView = connect(mapStateToProps)(settingView);
