import * as React from "react";
import ReactDOM from "react-dom";

import { App } from "./app";
import { processMessage } from "./processMessage";

import "./index.css";

window.addEventListener("message", (event) => {
  processMessage(event);
});
const root = window.document.getElementById("root");
ReactDOM.render(<App />, root);
