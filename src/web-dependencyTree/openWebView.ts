/**
 * @description create a web view to show frame graph
 */
import * as vscode from "vscode";
import * as paths from "../paths";
import * as path from "path";
import * as fs from "fs";
import { webViewHTMLPath } from "../paths";
import { getBaseWebViewUri } from "../utils/getWebViewUri";
import { messagePoster } from "../utils/message/messagePoster";
import { msgPostDependencyTreeDataToWebView } from "../utils/message/messages"
import {
  MESSAGE_ASSETS_BASE_URL,
  MESSAGE_FOLDER_PATH,
  MESSAGE_GET_LANGUAGE,
  MESSAGE_GET_ACTIVE_THEME_KIND
} from "../utils/message/messagesKeys";
import { DependencyTreeData } from "../data-dependencyTree/dependencyTreeData";
import { createWebviewPanel } from "../initExtension";
import { getCurrentFolderPath } from "../utils/getCurrentFolderPath";
import { getAllSettingFromSettingFile, getActiveTheme } from "../utils/fileSystem/setting/setting";
import { SETTING_KEY_ENTRY_FILE_PATH } from "../utils/fileSystem/settingKey";
import {
  statusMsgGetFolderPath,
  statusMsgGetEntryFile,
  statusMsgGetDependencyData,
  postSetting,
  msgGetSavedData,
} from "../utils/message/messages";

import { isPathExists } from "../utils/utils";
import { onError } from "../utils/error/onError";
import { GET_DEPENDENCY_TREE_FAIL, NO_WEBVIEW_PANEL } from "../utils/error/errorKey";
import { isSavedData } from "../utils/fileSystem/data";
import { logger } from "../utils/logger";
import { waitTime } from "../utils/utils";
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
      if (global.webViewPanel) {
        return (
          $1 +
          global.webViewPanel.webview
            .asWebviewUri(vscode.Uri.file(path.resolve(dirPath, $2)))
            .toString() +
          '"'
        )
      } else {
        onError(NO_WEBVIEW_PANEL);
        return ""
      }
    }
  );
  return html;
}

/**
 * @description create view
 */
export const createView = async function (): Promise<void> {
  if (global.webViewPanel) {
    global.webViewPanel.iconPath = vscode.Uri.file(paths.dependencygraphPNG);
    global.webViewPanel.webview.html = getWebViewContent(webViewHTMLPath);
    global.webViewPanel.onDidDispose(() => {
      global.webViewPanel = undefined;
    });
    while (!global.webViewReady) {
      await waitTime(10)
    }
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
  messagePoster.newMsg({
    key: MESSAGE_GET_LANGUAGE,
    value: vscode.env.language,
  });
  const folderPath = getCurrentFolderPath();
  messagePoster.newMsg({ key: MESSAGE_FOLDER_PATH, value: folderPath });
  messagePoster.newMsg({
    key: MESSAGE_GET_ACTIVE_THEME_KIND,
    value: getActiveTheme()
  })
  const baseWebViewUri = getBaseWebViewUri()
  messagePoster.newMsg({
    key: MESSAGE_ASSETS_BASE_URL,
    value: baseWebViewUri,
  });
};
const initWebView = function () {
  const columnToShowIn = vscode.window.activeTextEditor
    ? vscode.window.activeTextEditor.viewColumn
    : undefined;
  logger.info("reopen webView with tree data");
  messagePoster.clearMessagesQueue();
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
      msgGetSavedData;
    }
    if (
      entryFilePath &&
      isPathExists(path.join(folderPath as string, entryFilePath))
    ) {
      statusMsgGetEntryFile.postSuccess();
    } else {
      statusMsgGetEntryFile.postError();
    }
  }
}
export const reOpenWebViewWithTreeData = function (
  dependencyTreeData: DependencyTreeData | undefined
) {
  initWebView();
  if (global.webViewPanel) {
    openWebViewWithTreeData(dependencyTreeData);
  }
};
export const openWebViewWithTreeData = function (
  dependencyTreeData: DependencyTreeData | undefined
) {
  logger.info("open webView with tree data");
  if (!dependencyTreeData || !Object.keys(dependencyTreeData).length) {
    onError(GET_DEPENDENCY_TREE_FAIL);
    statusMsgGetDependencyData.postError();
    return undefined;
  }
  const setting = getAllSettingFromSettingFile();
  postSetting(setting);
  msgPostDependencyTreeDataToWebView();
};

export const openWebView = function () {
  logger.info("open webView");
  const setting = getAllSettingFromSettingFile();
  postSetting(setting);
}
