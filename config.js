var path = require('path')
var fs = require('fs')

var privateKey = fs.readFileSync(path.join(__dirname, 'keys/key_rsa'), { encoding: 'utf-8' })
var publicKey = fs.readFileSync(path.join(__dirname, 'keys/key_rsa.pub'), { encoding: 'utf-8' })

/**
 * default server setting
 */
module.exports = {
  host: process.env.host || 'localhost',
  port: process.env.port || 8808,
  assets: 'assets',
  secret: 'xbEa1EGS56yoLmZfF0gUh0tsfpCYWjt44AiDk5N9CCPDuBc9Nd4XWBAKOFTVA37',
  privateKey: privateKey,
  publicKey: publicKey,
  refreshTokenKey: `1G8G=9.kXUD!P89J:5C35iF6dLE8~5""6a0EKP2sMq7M0|9GRZ6y{7'El/eViUy`,
  universal: true,
  radiusIp: process.env.radiusip,
  radiusPort: process.env.radiusport,
  logFolder: process.env.logfolder || path.join(__dirname, './logs/'),
  recaptchaSecret: '6LcSzRQTAAAAAOMCnSZ_xx41-nCUBS2eLHQ7ga6x',
  mongo: 'mongodb://210.200.13.224:5505/universal',
  slackWebHook: 'https://hooks.slack.com/services/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',
  apiServer: process.env.apiServer || 'http://210.200.13.224:10080',
  apiVersion: 'v1alpha', // needs to restart dev server if this value changed during development, i.e. shutdown npm run dev and re-run this command.
}
