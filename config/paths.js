const path = require("path");

module.exports = {
  babelConfig: path.resolve(__dirname, "./babel.config.js"),
  mainjs: path.resolve(__dirname, "../src/extension.ts"),
  build: path.resolve(__dirname, "../outExtension"),
  src: path.resolve(__dirname, "../src"),
  config: path.resolve(__dirname),
};
