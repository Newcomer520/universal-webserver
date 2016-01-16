import gulp from 'gulp'
import nodemon from 'gulp-nodemon'
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

const bs = require('browser-sync').create()
const BROWSER_SYNC_RELOAD_DELAY = 500
let devMiddleware, bundler
const devServerEnv = {
	NODE_ENV: 'development/server',
	elip: process.env['elip'] || '210.200.13.224',
	elport: process.env['elport'] || '5500',
	redisip: process.env['redisip'] || '210.200.13.224',
	redisport: process.env['redisport'] || '5501',
	port: process.env['port'] || '8008'
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

gulp.task('dev', ['copy', 'watch-apidoc'], () => {
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
	console.log('init webpack..')
	env({
		vars: {
			NODE_ENV: 'development'
		}
	})
	const webpackConfig = require('./tools/webpack.config')[0]
	bundler = webpack(webpackConfig, (err, stats) => {
		if (err) {
			throw err
		}
		console.log('done')
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
	let serverInitialized = false
	nodemon({
		// exec: 'babel-node',
		// execMap: { js: 'node --debug' },
		// nodeArgs: ['--debug'],
		// nodemon our expressjs server
		script: 'tools/server-preloader.js',
		ext: 'js',
		// watch core server file(s) that require server restart on change
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

gulp.task('apidoc', (done) => {
	apidoc({
		src: 'src/server/api',
		dest: 'apidoc/',
		silent: false
	}, done)
})

gulp.task('watch-apidoc', ['apidoc'], () => gulp.watch('src/server/api/**/*.js', ['apidoc']))
