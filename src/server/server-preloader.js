var path = require('path')
var fs = require('fs')
var ROOT = process.env.ROOT || path.join(__dirname, '../../')
var config = path.join(ROOT, "./tools/webpack.config.universal.js")
var babelrc = JSON.parse(fs.readFileSync(path.join(ROOT, './.babelrc'), 'utf8'))
babelrc.plugins[0][1] = babelrc.plugins[0][1].map(a => {
    a.src = path.join(ROOT, a.src)
    return a
})
require('babel-register')({
	"plugins": [
		["babel-plugin-webpack-loaders",
			{ "config": config, "verbose": false }
		],
    babelrc.plugins[0],
    babelrc.plugins[1],
    babelrc.plugins[2],
	]
})
require("babel-polyfill")

global.config = require(path.join(ROOT, './config'))

if (!global.config.radiusIp || !global.config.radiusPort) {
  throw 'radius ip or radius port should be assigned'
}

global.__CLIENT__ = false
global.__DEV__ = process.env.NODE_ENV === 'development/server'
global.__HOST__ = global.config.host
global.__PORT__ = global.config.port


var app = module.exports = require('./server')

if (!module.parent) {
    var server = app.listen(global.config.port, () => {
    var host = server.address().address
    var port = server.address().port
    console.log('Server listening at http://%s:%s', host, port)
  })
}
