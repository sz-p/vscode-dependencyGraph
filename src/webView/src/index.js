import * as React from "react";
import ReactDOM from "react-dom";

import { App } from "./app";
import { processMessage } from "./processMessage";
import { msgWebViewReady, msgWebViewLog } from "./utils/messages.js";
import "./index.css";

const removeLoading = function () {
  const loadingDom = window.document.getElementById("dependencyGraphLoading");
  if (loadingDom) loadingDom.remove();
};

while (window.EVENTS_BEFORE_LISTENER && window.EVENTS_BEFORE_LISTENER.length) {
  const event = window.EVENTS_BEFORE_LISTENER.pop();
  processMessage(event);
}
window.removeEventListener("message", window.EVENTS_LISTENER_BEFORE_LOAD_JS);
window.addEventListener("message", (event) => {
  processMessage(event);
});
const root = window.document.getElementById("root");
ReactDOM.render(<App />, root);
msgWebViewReady.post();
msgWebViewLog("info", "web view ready")
removeLoading();
