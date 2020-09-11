const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
				test: /\.css$/,
				use: [
					{
						loader: require.resolve('style-loader')
					},
					{
						loader: require.resolve('css-loader')
					}
				]
			}
		]
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js', '.json', '.jsx', '.css', '.svg' ]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: paths.indexHTML
		})
	],
	devtool: 'source-map'
};
