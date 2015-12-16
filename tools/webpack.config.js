/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path'
import webpack from 'webpack'
import AssetsPlugin from 'assets-webpack-plugin'
import fs from 'fs'
import merge from 'lodash.merge'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin'
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools-configuration'))

// const DEBUG = !process.argv.includes('--release')
const DEBUG = process.env.NODE_ENV === 'development'
const VERBOSE = process.argv.includes('--verbose')
const WATCH = DEBUG //global.WATCH === undefined ? false : global.WATCH

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

const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  'process.env.port': process.env.port,
  __DEV__: DEBUG,
}

const nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------

const config = {	
  output: {
    publicPath: '/',
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
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
    alias: {
			components: path.join(__dirname, '..', './src/components')
    }
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
      // }, {
      //   test: /\.scss$/,
      //   loaders: [
      //     'style-loader',
      //     'css-loader?' + (DEBUG ? 'sourceMap&' : 'minimize&') +
      //     'modules&localIdentName=[name]_[local]_[hash:base64:3]',
      //     'postcss-loader',
      //   ],
      }, {
        test: /\.less$/,
        // loader: `style!css?${DEBUG? 'sourceMap': 'minimize'}!postcss!less?outputStyle=expanded&sourceMap`
        loaders: [
          'style-loader',
          'css-loader?' + (DEBUG ? 'sourceMap&' : 'minimize&') +
          'modules&localIdentName=[name]_[local]_[hash:base64:3]',
          'postcss-loader',
          'less-loader?outputStyle=expanded&sourceMap'
        ],
        // 'css?modules&sourceMap!postcss!less?outputStyle=expanded&sourceMap'
//{ test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!less?outputStyle=expanded&sourceMap=true&sourceMapContents=true') },        
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
      // require('postcss-import')({ addDependencyTo: bundler }), // postcss-import是提供方法可以解析@import 
      // require('precss')(), // precss是讓css可以寫類似sass的語法
      require('autoprefixer')({ browsers: AUTOPREFIXER_BROWSERS })
    ]
  }
}

//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------

const appConfig = merge({}, config, {
	context: path.join(__dirname, '../'),
  entry: {
  	// main: './src/main.js'
    main: [
      ...(WATCH ? ['webpack/hot/dev-server', 'webpack-hot-middleware/client'] : []),
      './src/main.js',
    ],
  },
  output: {
    path: path.join(__dirname, DEBUG? '../build/public/develop': '../build/public/'),
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
    ] : []),
    DEBUG? webpackIsomorphicToolsPlugin.development(): webpackIsomorphicToolsPlugin
  ]
})

// Enable React Transform in the "watch" mode
if (DEBUG) {
  appConfig.module.loaders
  .filter(x => WATCH && x.loader === 'babel-loader')
  .forEach(x => x.query = {
    // Wraps all React components into arbitrary transforms
    // https://github.com/gaearon/babel-plugin-react-transform
    plugins: ['react-transform'],
    extra: {
      'react-transform': {
        transforms: [
          {
            transform: 'react-transform-hmr',
            imports: ['react'],
            locals: ['module']
          }, {
            transform: 'react-transform-catch-errors',
            imports: ['react', 'redbox-react']
          }
        ]
      }
    }
  })  
} else {
  appConfig.module.loaders =
    appConfig.module.loaders.map(x => {
      if (x.test.test('.less') !== true) {
        return x
      }
      return { test: x.test, loader: ExtractTextPlugin.extract(x.loaders[0], x.loaders.slice(1).join('!')) }
    })
}

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = merge({}, config, {
  // entry: './src/server.js',
  entry: './tools/server-preloader.js',
  output: {
    path: './build',
    filename: 'server.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [
    /^\.\/assets\.json$/,
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
