const paths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  mode: "development",
  entry: paths.mainjs,
  output: {
    path: paths.build,
    filename: "bundle.[hash:8].js",
  },
  // loader
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [paths.src, paths.monacoDir],
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
        include: [paths.src, paths.monacoDir],
        use: [
          {
            loader: require.resolve("style-loader"),
          },
          {
            loader: require.resolve("css-loader"),
          },
        ],
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
      languages: ["json", "javascript"],
    }),
  ],
  devtool: "source-map",
};
