import "./settingView.css";
import { connect } from "react-redux";
import { PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { i18n } from "../../../../i18n/i18n";
import {
  RESOLVE_ALIAS,
  RESOLVE_PATH,
  CONFIRM,
  ADD,
  DELETE,
  NO_RESOLVE_ALIAS,
} from "../../../../i18n/types";
import { msgSetSetting } from "../../utils/messages";
import { SETTING_KEY_ALIAS } from "../../../../utils/setting/settingKey";
const addIcon = { iconName: "Add" };
const deleteIcon = { iconName: "Delete" };
const aliasSetting = function (props) {
  const { setting, language } = props;
  let [aliasState, setAliasState] = useState({
    path: "",
    alias: "",
  });
  let [aliasItemState, setAliasItemState] = useState([]);
  let [TEXT_RESOLVE_ALIAS, SET_TEXT_RESOLVE_ALIAS] = useState();
  let [TEXT_RESOLVE_PATH, SET_TEXT_RESOLVE_PATH] = useState();
  let [TEXT_SET_CONFIRM, SET_CONFIRM] = useState();
  let [TEXT_NO_RESOLVE_ALIAS, SET_TEXT_NO_RESOLVE_ALIAS] = useState();
  let [TEXT_ADD, SET_TEXT_ADD] = useState();
  let [TEXT_DELETE, SET_TEXT_DELETE] = useState();
  useEffect(() => {
    if (setting && setting[SETTING_KEY_ALIAS]) {
      let _aliasItemState = [];
      for (let key in setting[SETTING_KEY_ALIAS]) {
        _aliasItemState.push({
          alias: key,
          path: setting[SETTING_KEY_ALIAS][key],
        });
      }
      setAliasItemState(_aliasItemState);
    }
  }, [setting]);
  useEffect(() => {
    i18n.setLanguage(language);
    TEXT_RESOLVE_ALIAS = SET_TEXT_RESOLVE_ALIAS(i18n.getText(RESOLVE_ALIAS));
    TEXT_RESOLVE_PATH = SET_TEXT_RESOLVE_PATH(i18n.getText(RESOLVE_PATH));
    TEXT_NO_RESOLVE_ALIAS = SET_TEXT_NO_RESOLVE_ALIAS(
      i18n.getText(NO_RESOLVE_ALIAS)
    );
    TEXT_SET_CONFIRM = SET_CONFIRM(i18n.getText(CONFIRM));
    TEXT_ADD = SET_TEXT_ADD(i18n.getText(ADD));
    TEXT_DELETE = SET_TEXT_DELETE(i18n.getText(DELETE));
  }, [language]);
  const addAliasItemState = function () {
    if (aliasState.alias && aliasState.path) {
      for (let i = 0; i < aliasItemState.length; i++) {
        if (aliasItemState[i].alias === aliasState.alias) {
          notHave = false;
          break;
        }
      }
      aliasItemState.push({ ...aliasState });
      setAliasItemState([...aliasItemState]);
      aliasState.path = "";
      aliasState.alias = "";
      setAliasState({ path: "", alias: "" });
    }
  };
  const deleteAliasItemState = function (index) {
    aliasItemState.splice(index, 1);
    setAliasItemState([...aliasItemState]);
  };
  const setAlias = function () {
    let _aliasItem = {};
    for (let i = 0; i < aliasItemState.length; i++) {
      _aliasItem[aliasItemState[i].alias] = aliasItemState[i].path;
    }
    msgSetSetting(SETTING_KEY_ALIAS, _aliasItem).post();
  };
  const createResolveListDetail = function () {
    if (!aliasItemState.length) {
      return (
        <div className="setting-resolveList-detail">
          {TEXT_NO_RESOLVE_ALIAS}
        </div>
      );
    } else {
      let doms = [];
      for (let i = 0; i < aliasItemState.length; i++) {
        doms.push(
          <div
            key={aliasItemState[i].alias}
            className="setting-resolveList-detail-line"
          >
            <div className="setting-resolveList-detail-item alias">
              {aliasItemState[i].alias}
            </div>
            <div className="setting-resolveList-detail-item path">
              {aliasItemState[i].path}
            </div>
            <div className="setting-resolveList-detail-item delete">
              <PrimaryButton
                style={{ float: "right", height: "30px", width: "100%" }}
                iconProps={deleteIcon}
                onClick={() => deleteAliasItemState(i)}
              />
            </div>
          </div>
        );
      }
      return doms;
    }
  };
  return (
    <div className="settingView-resolveSetting">
      <div className="settingView-resolve">
        <TextField
          className="settingView-inputBox-alias"
          placeholder="@"
          label={TEXT_RESOLVE_ALIAS}
          onChange={(e, v) => {
            setAliasState({ alias: v, path: aliasState.path });
          }}
          value={aliasState.alias}
        />
        <TextField
          className="settingView-inputBox-path"
          placeholder="./src"
          label={TEXT_RESOLVE_PATH}
          onChange={(e, v) => {
            setAliasState({ alias: aliasState.alias, path: v });
          }}
          value={aliasState.path}
        />
        <PrimaryButton
          className="settingView-button"
          text={TEXT_ADD}
          iconProps={addIcon}
          onClick={addAliasItemState}
        />
      </div>
      <div className="setting-resolveList">
        <div className="setting-resolveList-title">
          <div className="setting-resolveList-title-item alias">
            {TEXT_RESOLVE_ALIAS}
          </div>
          <div className="setting-resolveList-title-item path">
            {TEXT_RESOLVE_PATH}
          </div>
          <div className="setting-resolveList-title-item delete">
            {TEXT_DELETE}
          </div>
        </div>
        {createResolveListDetail()}
      </div>
      <PrimaryButton
        className="settingView-button"
        text={TEXT_SET_CONFIRM}
        onClick={() => setAlias()}
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
export const AliasSetting = connect(mapStateToProps)(aliasSetting);
