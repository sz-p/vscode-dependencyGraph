const path = require('path');

module.exports = {
  babelConfig: path.resolve(__dirname, './babel.config.js'),
  indexHTML: path.resolve(__dirname, '../public/index.html'),
  public: path.resolve(__dirname, '../public'),
  mainjs: path.resolve(__dirname, '../src/index.js'),
  build: path.resolve(__dirname, '../../../out/webView'),
  webViewCode: path.resolve(__dirname, '../../webView'),
  src: path.resolve(__dirname, '../src'),
  config: path.resolve(__dirname),
  monacoDir: path.resolve(__dirname, '../../../node_modules/monaco-editor')
};
