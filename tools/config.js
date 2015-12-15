/**
 * default server setting
 */
// export default {
module.exports = {
	host: process.env.host || 'localhost',
	port: process.env.port || 8808,
	assets: 'assets'
}