import "./settingView.css";
import { connect } from "react-redux";
import { PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { i18n } from "../../../../i18n/i18n";
import {
  FOLDER,
  OPEN_FOLDER,
  ENTRY_FILE,
  SET_ENTRY_FILE,
} from "../../../../i18n/types";
import { msgOpenFolder, msgSetSetting } from "../../utils/messages";
import { SETTING_KEY_ENTRY_FILE_PATH } from "../../../../utils/fileSystem/settingKey";
import { action_getCommandWaitingStatus } from "../../actions/action";
const openFolder = function () {
  msgOpenFolder.post();
};
const setEntryFile = function (entryFilePath) {
  msgSetSetting(SETTING_KEY_ENTRY_FILE_PATH, entryFilePath).post();
};
const onEnter = function (entryFilePath) {
  return function (key) {
    if (key.key === "Enter" && entryFilePath !== undefined) {
      setEntryFile(entryFilePath);
    }
  };
};

/**
 * Format folder path to current OS style, collapse levels if too deep,
 * and abbreviate folder names longer than 20 characters.
 * @param {string} folderPath - Original absolute path
 * @returns {string} Formatted path
 */
export function formatFolderPath(folderPath) {
  if (!folderPath) return "";

  // Detect OS using process.platform if available, otherwise fallback to window.navigator.userAgent
  let isWindows = false;
  if (typeof process !== "undefined" && process.platform) {
    isWindows = process.platform === "win32";
  } else if (typeof window !== "undefined" && window.navigator) {
    isWindows = /Windows/i.test(window.navigator.userAgent);
  }

  // Normalize separators
  let parts = folderPath.replace(/\\/g, "/").split("/").filter(Boolean);

  // Abbreviate folder names longer than 20 characters
  parts = parts.map((part) => {
    if (part.length > 20) {
      return part.slice(0, 5) + "..." + part.slice(-5);
    }
    return part;
  });

  // Collapse levels if more than 5
  if (parts.length > 5) {
    parts = [...parts.slice(0, 3), "...", parts[parts.length - 1]];
  }

  // Join with system separator
  const sep = isWindows ? "\\" : "/";
  let formatted = (isWindows && /^[a-zA-Z]:/.test(folderPath))
    ? parts.join(sep)
    : sep + parts.join(sep);

  return formatted;
}

const folderAndEntry = function (props) {
  const { folderPath, setting, language } = props;
  let [entryFilePath, setEntryFilePath] = useState();
  let [TEXT_FOLDER, SET_TEXT_FOLDER] = useState();
  let [TEXT_OPEN_FOLDER, SET_TEXT_OPEN_FOLDER] = useState();
  let [TEXT_ENTRY_FILE, SET_TEXT_ENTRY_FILE] = useState();
  let [TEXT_SET_ENTRY_FILE, SET_SET_ENTRY_FILE] = useState();
  useEffect(() => {
    const onKeyPress = onEnter(entryFilePath);
    document.addEventListener("keypress", onKeyPress);
    return () => document.removeEventListener("keypress", onKeyPress);
  }, [entryFilePath]);
  useEffect(() => {
    if (setting && setting[SETTING_KEY_ENTRY_FILE_PATH]) {
      setEntryFilePath(setting[SETTING_KEY_ENTRY_FILE_PATH]);
    }
  }, [setting]);
  useEffect(() => {
    i18n.setLanguage(language);
    TEXT_FOLDER = SET_TEXT_FOLDER(i18n.getText(FOLDER));
    TEXT_OPEN_FOLDER = SET_TEXT_OPEN_FOLDER(i18n.getText(OPEN_FOLDER));
    TEXT_ENTRY_FILE = SET_TEXT_ENTRY_FILE(i18n.getText(ENTRY_FILE));
    TEXT_SET_ENTRY_FILE = SET_SET_ENTRY_FILE(i18n.getText(SET_ENTRY_FILE));
  }, [language]);
  return (
    <div className="settingView-errorArea">
      <div>
        <TextField
          className="settingView-inputBox"
          label={TEXT_FOLDER}
          disabled
          required
          value={formatFolderPath(folderPath)}
        />
        <PrimaryButton
          className="settingView-button"
          text={TEXT_OPEN_FOLDER}
          onClick={openFolder}
        />
      </div>
      <div>
        <TextField
          className="settingView-inputBox"
          label={TEXT_ENTRY_FILE}
          required
          prefix={formatFolderPath(folderPath)}
          onChange={(e, v) => {
            setEntryFilePath(v);
          }}
          value={entryFilePath}
        />
        <PrimaryButton
          className="settingView-button"
          text={TEXT_SET_ENTRY_FILE}
          onClick={() => {
            props.dispatch(
              action_getCommandWaitingStatus(SETTING_KEY_ENTRY_FILE_PATH)
            );
            setEntryFile(entryFilePath);
          }}
        />
      </div>
    </div>
  );
};



const mapStateToProps = (state) => {
  return {
    folderPath: state.folderPath,
    setting: state.setting,
    language: state.language,
  };
};
export const FolderAndEntry = connect(mapStateToProps)(folderAndEntry);
