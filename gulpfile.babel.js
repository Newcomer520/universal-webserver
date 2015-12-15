import gulp from 'gulp'
import nodemon from 'gulp-nodemon'
import config from './tools/config'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import { exec } from 'child_process'
const browserSync = require('browser-sync').create()

const BROWSER_SYNC_RELOAD_DELAY = 500

gulp.task('default', () => {
	
})

gulp.task('dev', ['dev-server', 'browser-sync'], () => {

})

gulp.task('dev-server', () => {
	let called = false
  nodemon({
		// nodemon our expressjs server
		script: './src/s-t.js',
		ext: 'js',
		// watch core server file(s) that require server restart on change
		watch: ['./src/s-t.js'],
		// env: { NODE_ENV: 'development' },
		// exec: 'babel-node'
	})
	// .on('start', function onStart() {
	// 	// ensure start only got called once
	// 	if (!called) { cb() }
	// 	called = true
	// })
	// .on('restart', function onRestart() {
	// 	// reload connected browsers after a slight delay
	// 	setTimeout(
	// 		() => console.log('resttart'),//browserSync.reload({ stream: false }), 
	// 		BROWSER_SYNC_RELOAD_DELAY
	// 	)
	// })
})

gulp.task('browser-sync', () => {

})