const paths = require("./paths");
module.exports = {
  mode: "development",
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  entry: paths.mainjs,
  output: {
    path: paths.build,
    filename: "extension.js",
    libraryTarget: "commonjs2",
  },
  externals: {
    vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  // loader
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      { test: /\.m?js/, type: "javascript/auto" },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    alias: {
      "@packages":paths.packages,
    },
    extensions: [".ts", ".mjs", ".js", ".json"],
  },
  plugins: [],
  devtool: "source-map",
};
