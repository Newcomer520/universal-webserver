var path = require('path')

module.exports = {
	output: {
		libraryTarget: 'commonjs2',
		publicPath: '/static/'
	},
	module: {
		loaders: [
			{
				test: /\.less$/,
				loaders: [
					'style-loader',
					'css-loader?sourceMap&modules&localIdentName=[name]_[local]_[hash:base64:3]',
					'postcss-loader',
					'less-loader?outputStyle=expanded&sourceMap'
				]
			}, {
				test: /\.css$/,
				loaders: [
					'style-loader',
					'css-loader?sourceMap&modules&localIdentName=[local]_[hash:base64:3]-[name]',
					'postcss-loader'
				],
				exclude: /node_modules/
			}, {
				test: /\.css$/,
				loaders: [
					'style-loader',
					'css-loader?sourceMap',
					'postcss-loader'
				],
				include: /node_modules/
			}, {
				test: /\.json$/,
				loader: 'json-loader',
			}, {
				test: /\.txt$/,
				loader: 'raw-loader',
			}, {
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
				loader: 'file-loader',
				// loader: 'url-loader?limit=10000',
			}, {
				test: /\.(eot|ttf|wav|mp3)$/,
				loader: 'file-loader',
			}, {
				test: /\.proto$/,
				loader: 'raw-loader'
			}
		],
	},
	postcss: function plugins(bundler) {
		return [
			require('postcss-import')({ path: [
				path.join(__dirname, '../src'),
			] }), //addDependencyTo: bundler,
			require('precss'),
			require("postcss-cssnext")(),
			require('postcss-nested'),
			require('postcss-simple-vars')({
				variables: function () {
					return require('../src/app/css/variables-with-js');
				}
			}),
			require('postcss-mixins')
		]
	}
}
