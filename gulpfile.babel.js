import 'babel-polyfill'
import gulp from 'gulp'
import nodemon from 'nodemon'
import config from './config'
import merge from 'lodash.merge'
import webpack from 'webpack'
import path from 'path'
import env from 'gulp-env'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import { exec, spawn } from 'child_process'
import runSequence from 'run-sequence'
import gutil from 'gulp-util'
import del from 'del'
import vinylPaths from 'vinyl-paths'
import apidoc from 'gulp-apidoc'
import mocha from 'gulp-mocha'
import OnBuildPlugin from './tools/OnBuildPlugin'

const bs = require('browser-sync').create()
const BROWSER_SYNC_RELOAD_DELAY = 500
let devMiddleware
let bundler
let serverInitialized = false

const devServerEnv = {
  NODE_ENV: 'development/server',
  port: process.env['port'] || '8008',
}


gulp.task('default', () => {

})

gulp.task('clean', cb => {
  return gulp.src(['.tmp', 'build/*', '!build/.git'])
    .pipe(vinylPaths(del))
})

gulp.task('copy', ['clean'], cb => {
  return gulp.src(['src/app/public/**/*', 'src/app/content/**/*'], { base: 'src/app'})
    .pipe(gulp.dest('build'))
})

gulp.task('dev', ['copy'], () => {
  runSequence('initWebpack', 'dev-server', 'browser-sync')
})

gulp.task('browser-sync', async (cb) => {
  bs.init({
    proxy: {
      target: `localhost:${devServerEnv.port}`,
      middleware: [
        devMiddleware,
      // bundler should be the same as above
        webpackHotMiddleware(bundler)
      ]
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
})

gulp.task('initWebpack', (cb) => {
  gutil.log('init webpack..')
  env({
    vars: {
      NODE_ENV: 'development'
    }
  })

  const webpackConfig = require('./tools/webpack.config')[0]
  webpackConfig.plugins.push(new OnBuildPlugin(stats => {
    if (serverInitialized) {
      setTimeout(nodemon.restart, 1000)
    }
  }))

  bundler = webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw err
    }
    gutil.log('webpack initialized done')
    cb()
  })
  devMiddleware = webpackDevMiddleware(bundler, {
    noInfo: true,
    quiet: false,
    publicPath: webpackConfig.output.publicPath,
    stats: webpackConfig.stats
  })
})

gulp.task('dev-server', cb => {
  nodemon({
    // exec: 'babel-node',
    // execMap: { js: 'node --debug' },
    // nodeArgs: ['--debug'],
    // nodemon our expressjs server
    script: 'tools/server-preloader.js',
    ext: 'js',
    // watch core server file(s) that require server restart on change
    watch: ["src/server/**/*.*", "tools/server-preloader.js"],
    // watch: ['src/**/*.js'],
    env: devServerEnv,
    stdout: false // must be false so that we could catch the stdout/stderr to ensure when the server is ready
  }).on('stdout', event => {
    gutil.log(event.toString())
    if (!serverInitialized) {
      const rule = /Server listening at http:\//
      if (rule.test(event.toString())) {
        serverInitialized = true
        cb()
      }
    }
  }).on('stderr', err => {
    gutil.log(gutil.colors.red(err.toString()))
  })
})

gulp.task('apidoc', done => {
  apidoc({
    src: 'src/server/api',
    dest: 'apidoc/',
    silent: false
  }, done)
})

gulp.task('watch-apidoc', ['apidoc'], () => gulp.watch('src/server/api/**/*.js', ['apidoc']))

gulp.task('build', ['copy', 'apidoc'], cb => {
  env({
    vars: {
      NODE_ENV: 'production'
    }
  })
  const webpackConfig = require('./tools/webpack.config')
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError("webpack", err)
    }
    gutil.log("[webpack]", stats.toString({
      // output options
    }))
    cb()
  })
})

gulp.task('mocha', () => {
  return gulp.src(['test/**/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list' }))
    .on('error', gutil.log)
})

gulp.task('test', [], () => {
  gulp.watch(['src/app/**', 'test/**'], ['mocha'])
})
