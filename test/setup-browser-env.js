var path = require('path')
var fs = require('fs')
var ROOT = process.env.ROOT || path.join(__dirname, '../')
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
