var path = require('path')
/**
 * default server setting
 */
module.exports = {
	host: process.env.host || 'localhost',
	port: process.env.port || 8808,
	assets: 'assets',
	secret: 'xbEa1EGS56yoLmZfF0gUh0tsfpCYWjt44AiDk5N9CCPDuBc9Nd4XWBAKOFTVA37',
	universal: true,
	redisIp: process.env.redisip,
	redisPort: process.env.redisport,
	logFolder: process.env.logfolder || path.join(__dirname, './logs/'),
	recaptchaSecret: '6LcSzRQTAAAAAOMCnSZ_xx41-nCUBS2eLHQ7ga6x',
	mongo: 'mongodb://210.200.13.224:5505/universal',
	slackWebHook: 'https://hooks.slack.com/services/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'
}
