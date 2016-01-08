var path = require('path')
/**
 * default server setting
 */
module.exports = {
	host: process.env.host || 'localhost',
	port: process.env.port || 8808,
	assets: 'assets',
	secret: 'xbEa1EGS56yoLmZfF0gUh0tsfpCYWjt44AiDk5N9CCPDuBc9Nd4XWBAKOFTVA37',
	universal: false,
	elIp: process.env["elip"] || 'localhost',
	elPort: process.env["elport"] || '9200',
	elTokenDuration: 60 * 1000,
	redisIp: process.env["redisip"],
	redisPort: process.env["redisport"],
	logFolder: process.env["logfolder"] || path.join(__dirname, './logs/'),
	recaptchaSecret: '6LcSzRQTAAAAAOMCnSZ_xx41-nCUBS2eLHQ7ga6x'
}
