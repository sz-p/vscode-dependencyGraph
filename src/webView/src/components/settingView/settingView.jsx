import * as React from "react";

import { connect } from "react-redux";
import { useState, useEffect } from "react";
import "./settingView.css";
import { FontIcon } from "office-ui-fabric-react/lib/Icon";
import { action_changeSettingStatus } from "../../actions/action";
import { store } from "../../reducers/store";
import { FolderAndEntry } from "./folderAndEntrySetting";
import { ResolveSetting } from "./resolveSetting";
import { AliasSetting } from "./aliasSetting";
import { i18n } from "../../../../i18n/i18n";
import { SETTING } from "../../../../i18n/types";
import { CommandView } from "../commandView/commandView";
import { SettingCommandStatusView } from "../settingCommandStatusView/settingCommandStatusView";
const settingView = function (props) {
  const { showSetting, language } = props;
  let [TEXT_SETTING, SET_TEXT_SETTING] = useState();
  useEffect(() => {
    i18n.setLanguage(language);
    TEXT_SETTING = SET_TEXT_SETTING(i18n.getText(SETTING));
  }, [language]);
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
        <h2>{TEXT_SETTING}</h2>
        <FolderAndEntry />
        <ResolveSetting />
        <AliasSetting />
        <CommandView />
        <SettingCommandStatusView />
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    showSetting: state.showSetting,
    language: state.language,
  };
};
export const SettingView = connect(mapStateToProps)(settingView);
