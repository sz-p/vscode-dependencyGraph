const paths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = {
  mode: "development",
  entry: [paths.mainjs, paths.monacoDir],
  output: {
    globalObject: "self",
    path: paths.build,
    filename: "bundle.[hash:8].js",
  },
  // loader
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: require.resolve("babel-loader"),
        options: {
          configFile: paths.babelConfig,
        },
      },
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "url-loader",
        options: {
          name: "[name].[ext]",
          context: "src",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json", ".jsx", ".css", ".svg", ".ttf"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.indexHTML,
    }),
    new MonacoWebpackPlugin({
      languages: ["javascript"],
      features: ["coreCommands"],
    }),
  ],
  devtool: "source-map",
};
