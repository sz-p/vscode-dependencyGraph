import * as React from "react";

import { connect } from "react-redux";
import "./status.css";
import { loadTheme } from "@fluentui/react";
import { dark, light } from "../../utils/theme";
import { useEffect, useState } from "react";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import {
  SUCCESS,
  FAILED,
  SETTING,
  SAVE_DATA,
  UPDATE_DATA,
  EXPORT_SVG,
  EXPORT_PNG,
  ENTRY_FILE,
  RESOLVE_EXTENSIONS,
  RESOLVE_ALIAS,
  WAITING,
} from "../../../../i18n/types";
import { i18n } from "../../../../i18n/i18n";
import {
  MESSAGE_EXPORT_PNG,
  MESSAGE_EXPORT_SVG,
  MESSAGE_SAVE_DATA,
  MESSAGE_UPDATE_DATA,
} from "../../../../utils/message/messagesKeys";
import {
  SETTING_KEY_ENTRY_FILE_PATH,
  SETTING_KEY_RESOLVE_EXTENSIONS,
  SETTING_KEY_ALIAS,
} from "../../../../utils/setting/settingKey";
const settingCommandStatusView = function (props) {
  const { language, commandSettingStatus, activeThemeKind } = props;
  let [messageData, setMessageData] = useState({});
  useEffect(() => {
    i18n.setLanguage(language);
  }, [language]);
  useEffect(() => {
    let messageBarType = undefined;
    let messageText = "";
    if (commandSettingStatus.value) {
      messageBarType = MessageBarType.success;
    } else {
      messageBarType = MessageBarType.error;
    }
    switch (commandSettingStatus.key) {
      case MESSAGE_EXPORT_PNG:
        messageText = messageText + i18n.getText(EXPORT_PNG);
        break;
      case MESSAGE_EXPORT_SVG:
        messageText = messageText + i18n.getText(EXPORT_SVG);
        break;
      case MESSAGE_SAVE_DATA:
        messageText = messageText + i18n.getText(SAVE_DATA);
        break;
      case MESSAGE_UPDATE_DATA:
        messageText = messageText + i18n.getText(UPDATE_DATA);
        break;
      case SETTING_KEY_ENTRY_FILE_PATH:
        messageText =
          messageText + i18n.getText(SETTING) + i18n.getText(ENTRY_FILE);
        break;
      case SETTING_KEY_RESOLVE_EXTENSIONS:
        messageText =
          messageText +
          i18n.getText(SETTING) +
          i18n.getText(RESOLVE_EXTENSIONS);
        break;
      case SETTING_KEY_ALIAS:
        messageText =
          messageText + i18n.getText(SETTING) + i18n.getText(RESOLVE_ALIAS);
        break;
    }
    if (commandSettingStatus.type === "waiting") {
      messageBarType = undefined;
      messageText = i18n.getText(WAITING) + messageText;
    } else {
      messageText = messageText + " ";
      switch (commandSettingStatus.value) {
        case true:
          messageText = messageText + i18n.getText(SUCCESS);
          break;
        case false:
          messageText = messageText + i18n.getText(FAILED);
          break;
      }
    }
    setMessageData({ messageBarType, messageText });
  }, [commandSettingStatus]);
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

  return (
    <div className="settingCommandStatusView">
      {Object.keys(commandSettingStatus).length ? (
        <MessageBar
          messageBarType={messageData.messageBarType}
          isMultiline={false}
        >
          {messageData.messageText}
        </MessageBar>
      ) : null}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
    commandSettingStatus: state.commandSettingStatus,
    activeThemeKind: state.activeThemeKind,
  };
};
export const SettingCommandStatusView = connect(mapStateToProps)(
  settingCommandStatusView
);
