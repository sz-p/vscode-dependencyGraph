import * as React from "react";
import { Provider } from "react-redux";
import { StatusView } from "./components/startStatusView/statusView";
import { SettingView } from "./components/settingView/settingView";
import { TreeView } from "./components/treeView/treeView";
import { FileInfoView } from "./components/fileInfoView/fileInfoView";
import { ToolBox } from "./components/toolBox/toolBox";
import { store } from "./reducers/store";
export const App = function () {
  return (
    <Provider store={store}>
      <StatusView />
      <SettingView />
      <TreeView />
      <FileInfoView />
      <ToolBox />
    </Provider>
  );
};
