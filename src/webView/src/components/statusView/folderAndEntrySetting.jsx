import "./status.css";
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
import { msgOpenFolder, msgSetEntryFile } from "../../utils/messages";
const openFolder = function () {
  msgOpenFolder.post();
};
const setEntryFile = function (entryFilePath) {
  msgSetEntryFile(entryFilePath).post();
};
const onEnter = function (entryFilePath) {
  return function (key) {
    if (key.key === "Enter" && entryFilePath !== undefined) {
      setEntryFile(entryFilePath);
    }
  };
};
const folderAndEntry = function (props) {
  const { folderPath, defaultEntryFilePath, language } = props;
  let [entryFilePath, setEntryFilePath] = useState(defaultEntryFilePath);
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
    setEntryFilePath(defaultEntryFilePath);
  }, [defaultEntryFilePath]);
  useEffect(() => {
    i18n.setLanguage(language);
    TEXT_FOLDER = SET_TEXT_FOLDER(i18n.getText(FOLDER));
    TEXT_OPEN_FOLDER = SET_TEXT_OPEN_FOLDER(i18n.getText(OPEN_FOLDER));
    TEXT_ENTRY_FILE = SET_TEXT_ENTRY_FILE(i18n.getText(ENTRY_FILE));
    TEXT_SET_ENTRY_FILE = SET_SET_ENTRY_FILE(i18n.getText(SET_ENTRY_FILE));
  }, [language]);
  return (
    <div className="statusView-errorArea">
      <div>
        <TextField
          className="statusView-inputBox"
          label={TEXT_FOLDER}
          disabled
          required
          value={folderPath}
        />
        <PrimaryButton
          className="statusView-button"
          text={TEXT_OPEN_FOLDER}
          onClick={openFolder}
        />
      </div>
      <div>
        <TextField
          className="statusView-inputBox"
          label={TEXT_ENTRY_FILE}
          required
          prefix={folderPath}
          onChange={(e, v) => {
            console.log(v);
            setEntryFilePath(v);
          }}
          value={entryFilePath}
        />
        <PrimaryButton
          className="statusView-button"
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
    defaultEntryFilePath: state.entryFilePath,
    language: state.language,
  };
};
export const FolderAndEntry = connect(mapStateToProps)(folderAndEntry);
