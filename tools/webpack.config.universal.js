const AUTOPREFIXER_BROWSERS = [
	'Android 2.3',
	'Android >= 4',
	'Chrome >= 35',
	'Firefox >= 31',
	'Explorer >= 9',
	'iOS >= 7',
	'Opera >= 12',
	'Safari >= 7.1',
]

module.exports = {
	output: {
		libraryTarget: 'commonjs2'
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
			test:   /\.css$/,
			loaders: [
					'style-loader',
					'css-loader?sourceMap&modules&localIdentName=[local]_[hash:base64:3]-[name]',
					'postcss-loader'
				],
			}, {
				test: /\.json$/,
				loader: 'json-loader',
			}, {
				test: /\.txt$/,
				loader: 'raw-loader',
			}, {
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
				loader: 'url-loader?limit=10000',
			}, {
				test: /\.(eot|ttf|wav|mp3)$/,
				loader: 'file-loader',
			},
		],
	},
	postcss: function plugins(bundler) {
		return [
			require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS }),
			require('precss'),
			require("postcss-cssnext")(),
			require('postcss-nested')
		]
	}
}
