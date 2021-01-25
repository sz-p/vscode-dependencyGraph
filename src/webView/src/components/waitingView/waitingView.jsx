import * as React from "react";
import { connect } from "react-redux";
import "./waitingView.css";
import { useEffect, useState } from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { i18n } from "../../../../i18n/i18n";
import { WAITING_DATA } from "../../../../i18n/types";
const waitingView = function (props) {
  const { language } = props;
  let [TEXT_WAITING_DATA, SET_TEXT_WAITING_DATA] = useState();
  useEffect(() => {
    i18n.setLanguage(language);
    TEXT_WAITING_DATA = SET_TEXT_WAITING_DATA(i18n.getText(WAITING_DATA));
  }, [language]);
  return (
    <div className="waitingView">
      <Spinner size={SpinnerSize.large} label={TEXT_WAITING_DATA} />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    language: state.language,
  };
};
export const WaitingView = connect(mapStateToProps)(waitingView);
