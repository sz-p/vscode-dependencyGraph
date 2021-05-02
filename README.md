<p align="middle" ><img src="https://github.com/sz-p/vscode-dependencyGraph/raw/HEAD/doc/logowithtext.png"/></p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=sz-p.dependencygraph" title="Check it out on the Visual Studio Marketplace">
    <img src="https://vsmarketplacebadge.apphb.com/version/sz-p.dependencygraph.svg" alt="Visual Studio Marketplace" style="display: inline-block" />
  </a>

  <img src="https://vsmarketplacebadge.apphb.com/installs/sz-p.dependencygraph.svg" alt="Number of installs"  style="display: inline-block;margin-left:10px" />
  
  <img src="https://vsmarketplacebadge.apphb.com/rating/sz-p.dependencygraph.svg" alt="Ratings" style="display: inline-block;margin-left:10px" />
</p>

<p align='center'>
English | <a href="https://github.com/sz-p/vscode-dependencyGraph/blob/master/README-zh-CN.md">简体中文</a>
</p>

## 📝 Introduction

A plugin for vscode to view your project's dependency graph

![DependencyGraph-screenshot](https://github.com/sz-p/vscode-dependencyGraph/raw/HEAD/doc/dependencyGraph.gif)

## 🔥 Features

* **Show dependency graph** show dependency graph by analyze the project file.
* **Save dependency tree data** save dependency tree data to local json file.
* **Export dependency graph img** export dependency graph's `svg` or `png`.
* **Extract basic information from file** extract file's `type,line,introduction,description` to display.
* **Extract function and comment from code file** extract code file's `function` and `comment` to display.

## ⚙️ Installation

### From marketplace

Search `dependencygraph` in extensions marketplace, download the extension in the following figure.

![install-from-marketplace](https://github.com/sz-p/vscode-dependencyGraph/raw/HEAD/doc/insteall-from-marketplace.png)

### From .vsix file

[download .vsix file](https://marketplace.visualstudio.com/items?itemName=sz-p.dependencygraph)

![download-vsix](https://github.com/sz-p/vscode-dependencyGraph/raw/HEAD/doc/download-vsix.png)

Use `.vsix` file install extension offline.

![instell-from-vsix](https://github.com/sz-p/vscode-dependencyGraph/raw/HEAD/doc/instell-from-vsix.png)

## 🚀 How to use

### Set entry file path

Set entry file path in `webview`.

![setting-entry-file](https://github.com/sz-p/vscode-dependencyGraph/raw/HEAD/doc/setting-entry-file-gui.png)

Set entry file path in setting file(setting file path is `.dependencygraph/setting.json`).

![setting-entry-file](https://github.com/sz-p/vscode-dependencyGraph/raw/HEAD/doc/setting-entry-file-settingfile.png)

### Set resolve or alias

Set `Resolve extensions` or `Resolve alias` in `webview`.

Add `Resolve alias` in input box, split by `,`. set `Resolve alias` and `Resolve path` click insert button to add item and don't forget click `Confirm`.

![setting-alias](https://github.com/sz-p/vscode-dependencyGraph/raw/HEAD/doc/setting-alias.png)

Set `Resolve extensions` or `Resolve alias` in setting file(setting file path is `.dependencygraph/setting.json`).

![setting-alias-settingfile](https://github.com/sz-p/vscode-dependencyGraph/raw/HEAD/doc/setting-alias-settingfile.png)

### Set file information and description

The extension recognizes `information` and `description` what is written in the following ways.

```js
/**
 * @introduction This is introduction
 *
 * @description This is description\n this sentences will show next row
 */
```

## 📝 Supported file

| File type | .js  | .ts  | .jsx | .tsx | .vue | .scss | .less | .sass | .py  | .php | .go  |
| -------- | ---- | ---- | ---- | ---- | ---- | ----- | ----- | ----- | ---- | ---- | ---- |
| Support status | ✅    | ✅    | ✅    | ✅    | ✅    | ✅     | ✅     | ✅     |      |      |      |

## 📝 How it work

1. Read entry file as string, get `introduction` and `description` by `regular expression`.
2. Use [babel parser](https://github.com/babel/babel/tree/main/packages/babel-parser) to get code file's `AST`. get file dependencies by `import` and `require` value from analyze `AST`.
3. Use [enhanced-resolve](https://github.com/webpack/enhanced-resolve) to get dependencies absolute path by value of `import`, `require` and file's absolute path. set dependencies absolute path to file queue.
4. Analyze file queue to get whole dependency tree.

##  🌌 Target 

To build a graph like `visual studio class view` for developer to view and analyze `dependency tree` or `module relationship`.

![visual-studio-class-view](https://github.com/sz-p/vscode-dependencyGraph/raw/HEAD/doc/visual-studio-class-view.png)

## 🔧  Develop

### `yarn install`

install necessary dependency packages.

### `yarn watch`

watch file change and build file.

### `F5`

press `F5` in vscode to start dev process.

## 🚦 Testing

### `yarn test`

You can find test case in [tests](https://github.com/sz-p/vscode-dependencyGraph/tree/master/tests). use `yarn test` to start testing.

## ⭐️ Show Your Support
Please give a ⭐️ if this project helped you!

## 👏 Contributing

If you have any questions or requests or want to contribute to `DependencyGraph`, please write the [issue](https://github.com/sz-p/vscode-dependencyGraph/issues) or give me a Pull Request freely.

## 🐞 Bug Report

If you find a bug, please report to us opening a new [Issue](https://github.com/sz-p/vscode-dependencyGraph/issues) on GitHub.
