import path from 'path'
import webpack from 'webpack'
import AssetsPlugin from 'assets-webpack-plugin'
import fs from 'fs'
import merge from 'lodash.merge'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import config from '../config'
const { output, postcss, ...webpackConfigUniversal } = require('./webpack.config.universal')
const DEBUG = process.env.NODE_ENV === 'development'
const VERBOSE = false
// const VERBOSE = process.argv.includes('--verbose')
const WATCH = DEBUG //global.WATCH === undefined ? false : global.WATCH



const GLOBALS = {
	'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
	'process.env.port': process.env.port,
	__DEV__: DEBUG,
	__CLIENT__: true,
	__UNIVERSAL__: config.universal
}

const nodeModules = {}
fs.readdirSync('node_modules')
	.filter(function(x) {
		return ['.bin'].indexOf(x) === -1
	})
	.forEach(function(mod) {
		nodeModules[mod] = 'commonjs ' + mod
	})

const babelrc = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'))
const alias = babelrc.plugins[0][1].map(a => ({ [a.expose]: path.join(__dirname, '..', a.src) }))

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const defaultConfig = {
	output: {
		publicPath: '/static/',
		sourcePrefix: '  '
	},

	cache: DEBUG,
	debug: DEBUG,

	stats: {
		colors: true,
		reasons: DEBUG,
		hash: VERBOSE,
		version: VERBOSE,
		timings: true,
		chunks: VERBOSE,
		chunkModules: VERBOSE,
		cached: VERBOSE,
		cachedAssets: VERBOSE,
	},

	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin(GLOBALS)
	],

	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
		alias: alias
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, '../src'),
					path.resolve(__dirname, '../tools'),
				],
				loader: 'babel-loader',
				exclude: /node_modules/
			}, {
				test: /\.less$/,
				loaders: [
					'style-loader',
					'css-loader?' + (DEBUG ? 'sourceMap&' : 'minimize&') +
					'modules&localIdentName=[name]_[local]_[hash:base64:3]',
					'postcss-loader',
					'less-loader?outputStyle=expanded&sourceMap'
				]
			}, {
				test: /\.css$/,
				loaders: [
					'style-loader',
					'css-loader?importLoaders=1' + (DEBUG ? '&' : '&minimize&') + 'modules&localIdentName=[local]_[hash:base64:3]-[name]', //(DEBUG ? 'sourceMap&' : 'minimize&') +
					'postcss-loader'
				],
				exclude: /node_modules/
			}, {
				test: /\.css$/,
				loaders: [
					'style-loader',
					'css-loader?&importLoaders=1' + (DEBUG ? '' : '&minimize'), //(DEBUG ? 'sourceMap&' : 'minimize&') +
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
		]
	},
	postcss: postcss
}
//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------

const appConfig = merge({}, defaultConfig, {
	context: path.join(__dirname, '../'),
	entry: {
		// main: './src/main.js'
		main: [
			...(WATCH ? ['webpack/hot/dev-server', 'webpack-hot-middleware/client'] : []),
			'babel-polyfill',
			'./src/app/main.js',
		],
	},
	output: {
		// path: path.join(__dirname, DEBUG? '../build/public/develop': '../build/public/'),
		path: path.join(__dirname, '../build/public/'),
		// filename: DEBUG ? '[name].js?[hash]' : '[name].[hash].js',
		filename: '[name].[hash].js'
	},

	// Choose a developer tool to enhance debugging
	// http://webpack.github.io/docs/configuration.html#devtool
	devtool: DEBUG ? 'source-map' : false,
	plugins: [
		new webpack.DefinePlugin(GLOBALS),
		new AssetsPlugin({
			path: path.join(__dirname, '../build'),
			filename: 'assets.json',
		}),
		...(!DEBUG ? [
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: VERBOSE,
				},
			}),
			new webpack.optimize.AggressiveMergingPlugin(),
			new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true})
		] : []),
		...(WATCH ? [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoErrorsPlugin(),
		] : [])
	]
})

if (!DEBUG) {
	appConfig.module.loaders =
		appConfig.module.loaders.map(x => {
			if (x.test.test('.less') !== true && x.test.test('.css') !== true) {
				return x
			}
			return { test: x.test, loader: ExtractTextPlugin.extract(x.loaders[0], x.loaders.slice(1).join('!')) }
		})
}
//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = merge({}, appConfig, {
	// entry: './tools/server-preloader.js',
	output: {
		libraryTarget: 'commonjs2'
	},
	target: 'node',
	externals: [
		// /^\.\/assets\.json$/,
		nodeModules
		//,
	//   function filter(context, request, cb) {
	//     const isExternal =
	//       request.match(/^[@a-z][a-z\/\.\-0-9]*$/i);
	//     cb(null, Boolean(isExternal));
	//   },
	],
	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
	},
	devtool: 'source-map',
	plugins: [
		new webpack.DefinePlugin(GLOBALS),
		new webpack.BannerPlugin('require("source-map-support").install();',
			{ raw: true, entryOnly: false })
	]
})
// export default [appConfig, serverConfig]
export default [appConfig]
