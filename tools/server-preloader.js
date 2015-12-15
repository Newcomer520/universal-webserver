/**
 * for using webpack-isomorphic-tools
 */
require('babel-core/register')
var path = require('path')
var WebpackIsomorphicTools = require('webpack-isomorphic-tools')

global.__DEV__ = process.env.NODE_ENV === 'development'
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('./webpack-isomorphic-tools-configuration'))
	.development(process.env.NODE_ENV === 'development')
	.server(path.join(__dirname, '..'), () => {
		require('../src/server')
	})
