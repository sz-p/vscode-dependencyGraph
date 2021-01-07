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
import { SETTING_KEY_ENTRY_FILE_PATH } from "../../../../utils/setting/settingKey";
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
          value={folderPath}
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
          prefix={folderPath}
          onChange={(e, v) => {
            setEntryFilePath(v);
          }}
          value={entryFilePath}
        />
        <PrimaryButton
          className="settingView-button"
          text={TEXT_SET_ENTRY_FILE}
          onClick={() => setEntryFile(entryFilePath)}
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
