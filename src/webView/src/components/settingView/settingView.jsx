import * as React from "react";

import { connect } from "react-redux";
import "./settingView.css";
import { FontIcon } from "office-ui-fabric-react/lib/Icon";
import { action_changeSettingStatus } from "../../actions/action";
import { store } from "../../reducers/store";

const settingView = function (props) {
  const { showSetting } = props;
  console.log(showSetting);
  return (
    <div
      className="settingView"
      style={{ display: showSetting ? "block" : "none" }}
    >
      <FontIcon
        iconName="ChromeClose"
        onClick={() => {
          store.dispatch(action_changeSettingStatus());
        }}
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    showSetting: state.showSetting,
  };
};
export const SettingView = connect(mapStateToProps)(settingView);
