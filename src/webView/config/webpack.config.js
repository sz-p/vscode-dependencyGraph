const paths = require('./paths');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

module.exports = {
	mode: 'development',
	entry: paths.mainjs,
	output: {
		path: paths.build,
		filename: 'bundle.[hash:8].js'
	},
	// loader
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: paths.src,
				loader: require.resolve('babel-loader'),
				options: {
					configFile: paths.babelConfig
				}
			},
			{
				test: /\.(ts|tsx)$/,
				loader: 'ts-loader'
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				loader: 'url-loader',
				options: {
					name: '[name].[ext]',
					context: 'src',
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: require.resolve('style-loader')
					},
					{
						loader: require.resolve('css-loader')
					}
				]
			},
			{
				test: /\.css$/,
				include: MONACO_DIR,
				use: [ 'style-loader', 'css-loader' ]
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js', '.json', '.jsx', '.css', '.svg', '.ttf' ]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: paths.indexHTML
		}),
		new MonacoWebpackPlugin({
			languages: [ 'json' ]
		})
	],
	devtool: 'source-map'
};
