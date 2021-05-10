import * as React from "react";
import ReactDOM from "react-dom";

import { App } from "./app";
import { processMessage } from "./processMessage";

import "./index.css";

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
