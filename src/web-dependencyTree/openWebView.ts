/**
 * @description create a web view to show frame graph
 */
import * as vscode from "vscode";
import * as paths from "../paths";
import * as path from "path";
import * as fs from "fs";
import { webViewHTMLPath } from "../paths";
import { getBaseWebViewUri } from "../utils/getWebViewUri";
import { postMessageCatchError } from "../utils/message/postMessageToWebView";
import {
  MESSAGE_ASSETS_BASE_URL,
  MESSAGE_DEPENDENCY_TREE_DATA,
  MESSAGE_FOLDER_PATH,
} from "../utils/message/messagesKeys";
import { DependencyTreeData } from "../data-dependencyTree/dependencyTreeData";
import { createWebviewPanel } from "../initExtension";
import { getCurrentFolderPath } from "../utils/utils";
import {
  getAllSettingFromSettingFile,
  SETTING_KEY_ENTRY_FILE_PATH,
} from "../utils/fileSystem/setting";

import {
  statusMsgGetFolderPath,
  statusMsgGetEntryFile,
  statusMsgGetDependencyData,
  msgGetLanguage,
  msgGetActiveThemeKind,
  postSetting,
  msgGetSavedData,
} from "../utils/message/messages";

import { isPathExists } from "../utils/utils";
import { onError } from "../utils/error/onError";
import { GET_DEPENDENCY_TREE_FAIL } from "../utils/error/errorKey";
import { isSavedData } from "../utils/fileSystem/data";

/**
 * 从某个HTML文件读取能被Webview加载的HTML内容
 * @param {*} templatePath 相对于插件根目录的html文件绝对路径
 */
function getWebViewContent(templatePath: string) {
  const dirPath = path.dirname(templatePath);
  let html = fs.readFileSync(templatePath, "utf-8");
  // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
  html = html.replace(
    /(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g,
    (m, $1, $2) => {
      return (
        $1 +
        vscode.Uri.file(path.resolve(dirPath, $2))
          .with({ scheme: "vscode-resource" })
          .toString() +
        '"'
      );
    }
  );
  return html;
}

/**
 * @description create view
 */
export const createView = function (): void {
  if (global.webViewPanel) {
    global.webViewPanel.iconPath = vscode.Uri.file(paths.framegraphPNG);
    global.webViewPanel.webview.html = getWebViewContent(webViewHTMLPath);
    global.webViewPanel.onDidDispose(() => {
      global.webViewPanel = undefined;
    });
    postNecessaryMessageWhenCreateView();
  }
};

/**
 * post necessary message when createView
 *
 * language
 * folderPath
 * theme kind
 * baseWebViewUri
 *
 */
export const postNecessaryMessageWhenCreateView = function (): void {
  // post language
  msgGetLanguage.post();
  const folderPath = getCurrentFolderPath();
  postMessageCatchError({ key: MESSAGE_FOLDER_PATH, value: folderPath });
  msgGetActiveThemeKind.post();
  postMessageCatchError({
    key: MESSAGE_ASSETS_BASE_URL,
    value: getBaseWebViewUri(),
  });
};

export const reOpenWebView = function (
  dependencyTreeData: DependencyTreeData | undefined
) {
  const columnToShowIn = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : undefined;
  if (global.webViewPanel) {
    // 如果我们已经有了一个面板，那就把它显示到目标列布局中
    global.webViewPanel.reveal(columnToShowIn);
  } else {
    createWebviewPanel();
    createView();
    const folderPath = getCurrentFolderPath();
    const setting = getAllSettingFromSettingFile();
    let entryFilePath = setting[SETTING_KEY_ENTRY_FILE_PATH];
    if (folderPath && isPathExists(folderPath)) {
      statusMsgGetFolderPath.postSuccess();
    } else {
      statusMsgGetFolderPath.postError();
    }
    if (isSavedData()) {
      msgGetSavedData.post();
    }
    if (
      entryFilePath &&
      isPathExists(path.join(folderPath as string, entryFilePath))
    ) {
      statusMsgGetEntryFile.postSuccess();
      postSetting(setting);
    } else {
      statusMsgGetEntryFile.postError();
    }
    openWebView(dependencyTreeData);
  }
};
export const openWebView = function (
  dependencyTreeData: DependencyTreeData | undefined
) {
  const folderPath = getCurrentFolderPath();
  if (!dependencyTreeData || !Object.keys(dependencyTreeData).length) {
    onError(GET_DEPENDENCY_TREE_FAIL);
    statusMsgGetDependencyData.postError();
    return undefined;
  }
  postMessageCatchError({
    key: MESSAGE_DEPENDENCY_TREE_DATA,
    value: {
      data: global.dependencyTreeData?.transportsData,
      folderPath,
    },
  });
};
