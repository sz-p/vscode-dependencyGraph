import * as React from "react";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { i18n } from "../../../../i18n/i18n";
import { COMMAND } from "../../../../i18n/types";
import "./commandView.css";
const commandView = function (props) {
  const { language } = props;
  let [TEXT_COMMAND, SET_TEXT_COMMAND] = useState();
  useEffect(() => {
    i18n.setLanguage(language);
    TEXT_COMMAND = SET_TEXT_COMMAND(i18n.getText(COMMAND));
  }, [language]);
  return (
    <div className="commandView">
      <h2>{TEXT_COMMAND}</h2>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export const CommandView = connect(mapStateToProps)(commandView);
