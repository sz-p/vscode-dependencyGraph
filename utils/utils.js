const webpack = require('webpack');
const fs = require('fs');
const watchOptions = {
  aggregateTimeout: 300,
  ignored: /node_modules/,
  poll: 1000
};
const buildCallback = (err, stats) => {
  let messages;
  if (err) {
    messages = {
      errors: [err.message]
    };
    console.log(messages);
  } else {
    messages = stats.toJson({ all: false, warnings: true, errors: true });
  }
  if (messages.errors.length) {
    if (messages.errors.length > 1) {
      messages.errors.length = 1;
    }
    console.log(new Error(messages.errors.join('\n\n')));
  }
}
function buildAndWatchSources(webpackConfig, buildPath) {
  const compiler = webpack(webpackConfig);
  fs.rmdirSync(buildPath, { recursive: true })
  compiler.watch(
    watchOptions,
    buildCallback
  );
}

module.exports = {
  buildAndWatchSources
}
