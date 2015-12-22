/**
 * default server setting
 */
module.exports = {
	host: process.env.host || 'localhost',
	port: process.env.port || 8808,
	assets: 'assets',
	secret: 'xbEa1EGS56yoLmZfF0gUh0tsfpCYWjt44AiDk5N9CCPDuBc9Nd4XWBAKOFTVA37',
	elIp: process.env["el-ip"] || 'localhost',
	elPort: process.env["el-port"] || '9200',
	elTokenDuration: 60 * 1000
}
