
import "./status.css"
import { connect } from 'react-redux';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState, useEffect } from 'react'
// TODO i18n
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
      <TextField className="statusView-inputBox" label="Folder" disabled required value={folderPath} />
      <PrimaryButton className="statusView-button" text="Open folder" onClick={openFolder} />
    </div>
    <div>
      <TextField className="statusView-inputBox" label="Entry file" required prefix={folderPath} onChange={(e, v) => { setEntryFilePath(v) }} value={entryFilePath} />
      <PrimaryButton className="statusView-button" text="Set entry file" onClick={() => setEntryFile(entryFilePath)} />
    </div>
  </div>)
}
const mapStateToProps = (state) => {
  return {
    folderPath: state.folderPath,
    defaultEntryFilePath: state.entryFilePath,
  }
};
export const ErrorDom = connect(mapStateToProps)(errorDom);
