## [1.1.5](https://github.com/sz-p/vscode-dependencyGraph/compare/v1.1.4...v1.1.5) (2022-03-01)


### Features

* show the dir name of index file in treeview ([29c456c](https://github.com/sz-p/vscode-dependencyGraph/commit/29c456c6ac036ceb16547518186f8c164dcc091f))


### Performance Improvements

* Increase node spacing ([df35331](https://github.com/sz-p/vscode-dependencyGraph/commit/df35331d636314da9f464d726f328153e8d0a35d))
* use svg attributes instead of styles ([a1fc21b](https://github.com/sz-p/vscode-dependencyGraph/commit/a1fc21bc4faca87865e96d99105f192bce127ce2))



## [1.1.4](https://github.com/sz-p/vscode-dependencyGraph/compare/v1.1.3...v1.1.4) (2021-11-11)


### Bug Fixes

* always waitting data problem ([e99c9a6](https://github.com/sz-p/vscode-dependencyGraph/commit/e99c9a6ba26334231053608477545d4afe752d97))


### Features

* mini exported svg file size ([2c35418](https://github.com/sz-p/vscode-dependencyGraph/commit/2c35418eab17a737d9f219479c4e2ec4e3b9ac7b))
* remove dependency-tree ([f2ffb7b](https://github.com/sz-p/vscode-dependencyGraph/commit/f2ffb7bc4d34d53c333574a906f94237909925e7))
* update packages ([e855480](https://github.com/sz-p/vscode-dependencyGraph/commit/e85548042cad5466b8a1bb254ebd9c7f2c610c17))



## [1.1.3](https://github.com/sz-p/vscode-dependencyGraph/compare/v1.1.2...v1.1.3) (2021-06-08)


### Features

* get alias from ts js config ([d07f277](https://github.com/sz-p/vscode-dependencyGraph/commit/d07f2776cad2851cfbf56cf789a03a97a37c3310))
* mini exported svg file size ([ef90348](https://github.com/sz-p/vscode-dependencyGraph/commit/ef903482ae0a6ee2cdc4bca91b60416f8407da89))
* post setting to webview when open webview ([c77b5c2](https://github.com/sz-p/vscode-dependencyGraph/commit/c77b5c2df633df0df06d694a288c83294fdbc1f5))



## [1.1.2](https://github.com/sz-p/vscode-dependencyGraph/compare/v1.1.0...v1.1.2) (2021-05-28)


### Features

* add loading view in webview html ([e99af3d](https://github.com/sz-p/vscode-dependencyGraph/commit/e99af3d7202bc9543505794118c240b711148973))


## [1.1.1](https://github.com/sz-p/vscode-dependencyGraph/compare/v1.1.0...v1.1.1) (2021-05-26)


### Features

* add file path in tree view and file info view ([afe9006](https://github.com/sz-p/vscode-dependencyGraph/commit/afe900683ecb0898b90a61e1fe3099b85b8c049a))



# [1.1.0](https://github.com/sz-p/vscode-dependencyGraph/compare/v1.0.2...v1.1.0) (2021-05-11)


### Bug Fixes

* [#6](https://github.com/sz-p/vscode-dependencyGraph/issues/6) work at vscode 1.56.0 ([73ffe53](https://github.com/sz-p/vscode-dependencyGraph/commit/73ffe538501aed14ad744d793cdf24472a61d671))


### Features

* [#5](https://github.com/sz-p/vscode-dependencyGraph/issues/5) dependency tree js/ts parser support export {...} from xxx ([76917bc](https://github.com/sz-p/vscode-dependencyGraph/commit/76917bc40e630ffa3e9aba423dc4fdf667df3adb))

## [1.0.2](https://github.com/sz-p/vscode-dependencyGraph/compare/v1.0.1...v1.0.2) (2021-04-30)


### Bug Fixes

* update readme change readme url ([b932dce](https://github.com/sz-p/vscode-dependencyGraph/commit/b932dcebfcba4ad880a455d2486b39b16faca64a))



## [1.0.1](https://github.com/sz-p/vscode-dependencyGraph/compare/v1.0.0...v1.0.1) (2021-04-30)


### Bug Fixes

* change readme img url ([97349de](https://github.com/sz-p/vscode-dependencyGraph/commit/97349de3539371e41b20affe7bd47b81f015619e))


### Features

* add changelog ([67a5ea1](https://github.com/sz-p/vscode-dependencyGraph/commit/67a5ea15befa565ed525ca3022020f787bd6077f))



# [1.0.0](https://github.com/sz-p/vscode-dependencyGraph/compare/v0.1.6...v1.0.0) (2021-04-30)

### Features

* **Show dependency graph** show dependency graph by analyze the project file.
* **Save dependency tree data** save dependency tree data to local json file.
* **Export dependency graph img** export dependency graph's `svg` or `png`.
* **Extract basic information from file** extract file's `type,line,introduction,description` to display.
* **Extract function and comment from code file** extract code file's `function` and `comment` to display.
