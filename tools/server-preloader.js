require('babel-core/register')({
	"plugins": [
		["babel-plugin-webpack-loaders",
			{ "config": "./tools/webpack.config.universal.js", "verbose": false }
		]
	]
})
require("babel-polyfill")
var path = require('path')

global.config = require('../config')
global.__DEV__ = process.env.NODE_ENV === 'development/server'
global.__HOST__ = global.config.host
global.__PORT__ = global.config.port

if (!config.redisIp || !config.redisPort) {
	throw new Error("Redis IP and port should be assigned.")
}

require('../src/server/server')
