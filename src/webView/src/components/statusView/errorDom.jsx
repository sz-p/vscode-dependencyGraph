
import "./status.css"
import { connect } from 'react-redux';
import { PrimaryButton, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
// TODO i18n

const openFolder = function () {
  window.console.log('openFolder');
}
const setEntryFile = function () {
  window.console.log('setEntryFile');
}
const errorDom = function (props) {
  const { folderPath, entryFilePath } = props;
  console.log(folderPath);
  console.count("render errorDom")
  return (<div className="statusView-errorArea">
    <div>
      <TextField className="statusView-inputBox" label="Folder" disabled required value={folderPath} />
      <PrimaryButton className="statusView-button" text="Open folder" onClick={openFolder} />
    </div>
    <div>
      <TextField className="statusView-inputBox" label="Entry file" required prefix={folderPath} value={entryFilePath} />
      <PrimaryButton className="statusView-button" text="Set entry file" onClick={setEntryFile} />
    </div>
  </div>)
}
const mapStateToProps = (state) => {
  return {
    folderPath: state.folderPath,
    entryFilePath: state.entryFilePath
  }
};
export const ErrorDom = connect(mapStateToProps)(errorDom);
