/**
 * React Starter Kit (http://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2015 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import browserSync from 'browser-sync'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import run from './run'
import config from '../config'

global.WATCH = true
const webpackConfig = require('./webpack.config')[0] // Client-side bundle configuration
const bundler = webpack(webpackConfig)
const bs = browserSync.create()
/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function develop() {
	const devMiddleware = webpackDevMiddleware(bundler, { publicPath: webpackConfig.output.publicPath, stats: webpackConfig.stats })
  await run(require('./clean-and-copy'))
  await run(require('./serve'))
  bs.init({
    proxy: {

      target: `localhost:${config.port}`,

      middleware: [
      	devMiddleware,
        // bundler should be the same as above
        webpackHotMiddleware(bundler)
      ],
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
      'build/public/**/*.css',
      'build/public/**/*.html',
      'build/content/**/*.*',
      'build/templates/**/*.*'
    ]
  })
}

export default develop
