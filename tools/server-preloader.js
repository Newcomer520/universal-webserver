/**
 * for using webpack-isomorphic-tools
 */
require('babel-core/register')
var path = require('path')
var WebpackIsomorphicTools = require('webpack-isomorphic-tools')

global.config = require('../config')
global.__DEV__ = process.env.NODE_ENV === 'development/server'
global.__HOST__ = global.config.host
global.__PORT__ = global.config.port

if (!config.redisIp || !config.redisPort) {
	throw new Error("Redis IP and port should be assigned.")
}
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack-isomorphic-tools-configuration'))
	.development(process.env.NODE_ENV === 'development/server')
	.server(path.join(__dirname, '..'), () => {
		require('../src/server/server')
	})
