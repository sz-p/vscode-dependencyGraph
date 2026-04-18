import * as React from "react";
import { connect } from "react-redux";
import "./toolBox.css";
import { useEffect, useState } from "react";
import { FontIcon } from "office-ui-fabric-react/lib/Icon";
import { i18n } from "../../../../i18n/i18n";
import { SETTING, SAVE, EXPORT } from "../../../../i18n/types";
import { action_changeSettingStatus, action_setLayout } from "../../actions/action";
import { store } from "../../reducers/store";

const LAYOUT_OPTIONS = [
  { id: "force", label: "Auto (Force)" },
  { id: "hierarchical", label: "Hierarchical" },
  { id: "radial", label: "Radial" },
  { id: "grid", label: "Grid" },
];

const toolBox = function (props) {
  const { language, layout } = props;
  let [TEXT_SETTING, SET_TEXT_SETTING] = useState();
  let [TEXT_SAVE, SET_TEXT_SAVE] = useState();
  let [TEXT_EXPORT, SET_TEXT_EXPORT] = useState();
  useEffect(() => {
    i18n.setLanguage(language);
    TEXT_SETTING = SET_TEXT_SETTING(i18n.getText(SETTING));
    TEXT_SAVE = SET_TEXT_SAVE(i18n.getText(SAVE));
    TEXT_EXPORT = SET_TEXT_EXPORT(i18n.getText(EXPORT));
  }, [language]);
  // let [doms, setDoms] = useState([]);
  // let [error, setError] = useState(false);
  // const {
  //   getDataStatus,
  //   viewHash,
  //   gotDependencyTreeData,
  //   activeThemeKind,
  // } = props;

  // useEffect(() => {
  //   if (viewHash) {
  //     (doms = []), setDoms(doms);
  //   }
  // }, [viewHash]);
  // useEffect(() => {
  //   if (activeThemeKind) {
  //     switch (activeThemeKind) {
  //       case "Light":
  //         loadTheme(light);
  //         break;
  //       default:
  //         loadTheme(dark);
  //         break;
  //     }
  //   }
  // }, [activeThemeKind]);
  // useEffect(() => {
  //   if (getDataStatus && !error) {
  //     if (getDataStatus.status === "error") {
  //       setError(true);
  //     }
  //     setDoms(
  //       doms.concat(
  //         <StatusDom
  //           key={getDataStatus.type}
  //           type={getDataStatus.type}
  //           status={getDataStatus.status}
  //         />
  //       )
  //     );
  //   }
  // }, [getDataStatus]);
  // if (gotDependencyTreeData) return null;
  return (
    <div className="toolBox">
      <FontIcon
        iconName="Settings"
        title={TEXT_SETTING}
        className="toolBoxIcon"
        onClick={() => {
          store.dispatch(action_changeSettingStatus());
        }}
      />
      <select
        className="toolBoxLayoutSelect"
        value={layout || "force"}
        onChange={(e) => store.dispatch(action_setLayout(e.target.value))}
        title="Layout"
      >
        {LAYOUT_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
    layout: state.layout,
  };
};
export const ToolBox = connect(mapStateToProps)(toolBox);
