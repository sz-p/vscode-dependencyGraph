const webpack = require("webpack");
const fs = require("fs");
const watchOptions = {
  aggregateTimeout: 300,
  ignored: ["**/node_modules", "**/outExtension", "**/outWebView"],
  poll: 1000,
};
const buildCallback = (err, stats) => {
  let messages;
  if (err) {
    messages = {
      errors: [err.message],
    };
    console.log(messages);
  } else {
    messages = stats.toJson({ all: false, warnings: true, errors: true });
  }
  if (messages.errors.length) {
    console.error(messages.errors);
  }
};
function watchSources(webpackConfig, buildPath) {
  const compiler = webpack(webpackConfig);
  compiler.watch(watchOptions, buildCallback);
}
function buildSources(webpackConfig, buildPath) {
  const compiler = webpack(webpackConfig);
  fs.rmdirSync(buildPath, { recursive: true });
  compiler.run(buildCallback);
}
module.exports = {
  watchSources,
  buildSources,
};
