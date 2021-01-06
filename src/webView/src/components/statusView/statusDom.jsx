import * as React from "react";
import {
  MessageBar,
  MessageBarType,
  initializeIcons,
} from "office-ui-fabric-react";
import { useEffect, useState } from "react";

import { FolderAndEntry } from "../settingView/folderAndEntrySetting";
import { i18n } from "../../../../i18n/i18n";
import { SUCCESS, FAILED } from "../../../../i18n/types";
import { connect } from "react-redux";
initializeIcons();
function getText(statusKey, status) {
  const text =
    statusKey + ": " + i18n.getText(statusKey) + ": " + i18n.getText(status);
  return text;
}
const statusDom = function (props) {
  const { type, status, language } = props;
  let [TEXT_FAILED, SET_TEXT_FAILED] = useState();
  let [TEXT_SUCCESS, SET_TEXT_SUCCESS] = useState();
  useEffect(() => {
    i18n.setLanguage(language);
    TEXT_FAILED = SET_TEXT_FAILED(getText(type, FAILED));
    TEXT_SUCCESS = SET_TEXT_SUCCESS(getText(type, SUCCESS));
  }, [language]);
  if (status === "success") {
    return (
      <MessageBar
        key={type}
        messageBarType={MessageBarType.success}
        isMultiline={false}
      >
        {" "}
        {TEXT_SUCCESS}
      </MessageBar>
    );
  }
  if (status === "error") {
    return [
      <MessageBar
        key={type}
        messageBarType={MessageBarType.error}
        isMultiline={false}
      >
        {" "}
        {TEXT_FAILED}
      </MessageBar>,
      <FolderAndEntry key={"error_" + type} />,
    ];
  }
  return null;
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export const StatusDom = connect(mapStateToProps)(statusDom);
