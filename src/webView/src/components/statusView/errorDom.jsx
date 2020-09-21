
import "./status.css"
import { connect } from 'react-redux';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState, useEffect } from 'react'
import { i18n } from "../../../../i18n/i18n";
import { FOLDER, OPEN_FOLDER, ENTRY_FILE, SET_ENTRY_FILE } from "../../../../i18n/types";
import { msgOpenFolder, msgSetEntryFile } from '../../utils/messages'
const openFolder = function () {
  msgOpenFolder.post();
}
const setEntryFile = function (entryFilePath) {
  msgSetEntryFile(entryFilePath).post()
}
const onEnter = function (entryFilePath) {
  return function (key) {
    console.log(entryFilePath)
    console.log(key)
    if (key.key === "Enter" && entryFilePath !== undefined) {
      setEntryFile(entryFilePath)
    }
  }
}
const errorDom = function (props) {
  const { folderPath, defaultEntryFilePath } = props;
  let [entryFilePath, setEntryFilePath] = useState(defaultEntryFilePath);
  useEffect(() => {
    const onKeyPress = onEnter(entryFilePath)
    document.addEventListener("keypress", onKeyPress);
    return () => document.removeEventListener("keypress", onKeyPress)
  }, [entryFilePath])
  return (<div className="statusView-errorArea">
    <div>
      <TextField className="statusView-inputBox" label={i18n.getText(FOLDER)} disabled required value={folderPath} />
      <PrimaryButton className="statusView-button" text={i18n.getText(OPEN_FOLDER)} onClick={openFolder} />
    </div>
    <div>
      <TextField className="statusView-inputBox" label={i18n.getText(ENTRY_FILE)} required prefix={folderPath} onChange={(e, v) => { setEntryFilePath(v) }} value={entryFilePath} />
      <PrimaryButton className="statusView-button" text={i18n.getText(SET_ENTRY_FILE)} onClick={() => setEntryFile(entryFilePath)} />
    </div>
  </div>)
}
const mapStateToProps = (state) => {
  return {
    folderPath: state.folderPath,
    defaultEntryFilePath: state.entryFilePath
  }
};
export const ErrorDom = connect(mapStateToProps)(errorDom);
