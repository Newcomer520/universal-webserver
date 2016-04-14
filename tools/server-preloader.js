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

if (!global.config.radiusIp || !global.config.radiusPort) {
  throw 'radius ip or radius port should be assigned'
}

global.__CLIENT__ = false
global.__DEV__ = process.env.NODE_ENV === 'development/server'
global.__HOST__ = global.config.host
global.__PORT__ = global.config.port


require('../src/server/server')
