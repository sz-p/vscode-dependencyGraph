import "./settingView.css";
import { connect } from "react-redux";
import { PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { i18n } from "../../../../i18n/i18n";
import { RESOLVE_EXTENSIONS, CONFIRM } from "../../../../i18n/types";
import { msgSetSetting } from "../../utils/messages";
import { SETTING_KEY_RESOLVE_EXTENSIONS } from "../../../../utils/fileSystem/settingKey";
import { action_getCommandWaitingStatus } from "../../actions/action";
const setResolveExtensions = function (resolveExtensions) {
  msgSetSetting(
    SETTING_KEY_RESOLVE_EXTENSIONS,
    resolveExtensions.split(",")
  ).post();
};
const resolveSetting = function (props) {
  const { setting, language } = props;
  let [resolveExtensions, setResolveExtensionStatus] = useState();
  let [TEXT_RESOLVE_EXTENSIONS, SET_RESOLVE_EXTENSIONS] = useState();
  let [TEXT_SET_CONFIRM, SET_CONFIRM] = useState();
  useEffect(() => {
    if (setting && setting[SETTING_KEY_RESOLVE_EXTENSIONS]) {
      setResolveExtensionStatus(
        setting[SETTING_KEY_RESOLVE_EXTENSIONS].toString()
      );
    }
  }, [setting]);
  useEffect(() => {
    i18n.setLanguage(language);
    TEXT_RESOLVE_EXTENSIONS = SET_RESOLVE_EXTENSIONS(
      i18n.getText(RESOLVE_EXTENSIONS)
    );
    TEXT_SET_CONFIRM = SET_CONFIRM(i18n.getText(CONFIRM));
  }, [language]);
  return (
    <div className="settingView-resolveSetting">
      <TextField
        className="settingView-inputBox"
        label={TEXT_RESOLVE_EXTENSIONS}
        onChange={(e, v) => {
          setResolveExtensionStatus(v);
        }}
        value={resolveExtensions}
      />
      <PrimaryButton
        className="settingView-button"
        text={TEXT_SET_CONFIRM}
        onClick={() => {
          props.dispatch(
            action_getCommandWaitingStatus(SETTING_KEY_RESOLVE_EXTENSIONS)
          );
          setResolveExtensions(resolveExtensions);
        }}
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    setting: state.setting,
    language: state.language,
  };
};
export const ResolveSetting = connect(mapStateToProps)(resolveSetting);
