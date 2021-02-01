import * as React from "react";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import {
  ContextualMenu,
  PrimaryButton,
  DefaultButton,
} from "office-ui-fabric-react";
// import { , , IContextualMenuProps, IIconProps } from 'office-ui-fabric-react';

import { TooltipHost } from "office-ui-fabric-react/lib/Tooltip";
import { i18n } from "../../../../i18n/i18n";
import {
  COMMAND,
  SAVE_DATA,
  SAVE_DATA_TOOLTIP,
  UPDATE_DATA,
  UPDATE_DATA_TOOLTIP,
  EXPORT,
  EXPORT_SVG,
  EXPORT_PNG,
} from "../../../../i18n/types";
import { useId } from "@uifabric/react-hooks";
import "./commandView.css";
const calloutProps = { gapSpace: 0 };
const hostStyles = {
  root: { display: "inline-block", width: "18%", marginRight: "20px" },
};
function _getMenu(props) {
  return <ContextualMenu {...props} />;
}
function _onMenuClick(ev) {
  console.log(ev);
}
const commandView = function (props) {
  const tooltipId_saveData = useId("tooltipId_saveData");
  const tooltipId_updateData = useId("tooltipId_updateData");
  const { language, savedData } = props;
  let [TEXT_COMMAND, SET_TEXT_COMMAND] = useState();
  let [TEXT_SAVE_DATA, SET_TEXT_SAVE_DATA] = useState();
  let [TEXT_SAVE_DATA_TOOLTIP, SET_TEXT_SAVE_DATA_TOOLTIP] = useState();
  let [TEXT_UPDATE_DATA, SET_TEXT_UPDATE_DATA] = useState();
  let [TEXT_UPDATE_DATA_TOOLTIP, SET_TEXT_UPDATE_DATA_TOOLTIP] = useState();
  let [TEXT_EXPORT, SET_TEXT_EXPORT] = useState();
  let [TEXT_EXPORT_SVG, SET_TEXT_EXPORT_SVG] = useState();
  let [TEXT_EXPORT_PNG, SET_TEXT_EXPORT_PNG] = useState();
  useEffect(() => {
    i18n.setLanguage(language);
    TEXT_COMMAND = SET_TEXT_COMMAND(i18n.getText(COMMAND));
    TEXT_SAVE_DATA = SET_TEXT_SAVE_DATA(i18n.getText(SAVE_DATA));
    TEXT_UPDATE_DATA = SET_TEXT_UPDATE_DATA(i18n.getText(UPDATE_DATA));
    TEXT_UPDATE_DATA_TOOLTIP = SET_TEXT_UPDATE_DATA_TOOLTIP(
      i18n.getText(UPDATE_DATA_TOOLTIP)
    );
    TEXT_EXPORT = SET_TEXT_EXPORT(i18n.getText(EXPORT));
    TEXT_EXPORT_SVG = SET_TEXT_EXPORT_SVG(i18n.getText(EXPORT_SVG));
    TEXT_EXPORT_PNG = SET_TEXT_EXPORT_PNG(i18n.getText(EXPORT_PNG));

    TEXT_SAVE_DATA_TOOLTIP = SET_TEXT_SAVE_DATA_TOOLTIP(
      i18n.getText(SAVE_DATA_TOOLTIP)
    );
  }, [language]);
  const menuProps = {
    // For example: disable dismiss if shift key is held down while dismissing
    onDismiss: (ev) => {
      if (ev && ev.shiftKey) {
        ev.preventDefault();
      }
    },
    items: [
      {
        key: "svg",
        text: TEXT_EXPORT_SVG,
        // iconProps: { iconName: "Mail" },
      },
      {
        key: "png",
        text: TEXT_EXPORT_PNG,
        // iconProps: { iconName: "Calendar" },
      },
    ],
    directionalHintFixed: true,
  };
  return (
    <div className="commandView">
      <h2 className="commandView-title">{TEXT_COMMAND}</h2>
      <div>
        {!savedData ? (
          <TooltipHost
            content={TEXT_SAVE_DATA_TOOLTIP}
            id={tooltipId_saveData}
            calloutProps={calloutProps}
            styles={hostStyles}
          >
            <PrimaryButton
              style={{ width: "100%" }}
              className="commandView-button commandView-button-save"
              text={TEXT_SAVE_DATA}
              onClick={() => {
                console.log("save");
              }}
            />
          </TooltipHost>
        ) : (
          <TooltipHost
            content={TEXT_UPDATE_DATA_TOOLTIP}
            id={tooltipId_updateData}
            calloutProps={calloutProps}
            styles={hostStyles}
          >
            <PrimaryButton
              style={{ width: "100%" }}
              className="commandView-button commandView-button-update"
              text={TEXT_UPDATE_DATA}
              onClick={() => {
                console.log("update");
              }}
            />
          </TooltipHost>
        )}

        <TooltipHost
          // content={TEXT_UPDATE_DATA_TOOLTIP}
          id={tooltipId_updateData}
          calloutProps={calloutProps}
          styles={hostStyles}
        >
          <PrimaryButton
            className="commandView-button commandView-button-export"
            style={{ width: "100%", top: "3px" }}
            text={TEXT_EXPORT}
            iconProps={{ iconName: "Export" }}
            menuProps={menuProps}
            menuAs={_getMenu}
            onMenuClick={_onMenuClick}
            allowDisabledFocus
          />
        </TooltipHost>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
    savedData: state.savedData,
  };
};
export const CommandView = connect(mapStateToProps)(commandView);
