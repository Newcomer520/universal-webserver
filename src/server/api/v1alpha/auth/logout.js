import authHelper, { COOKIE_AUTH_TOKEN } from 'server/helpers/server-auth-helper'

const Logout = module.exports = function() {}

//TODO how to use apidoc here
Logout.prototype.jwt = function *(next) {
	try {
		yield authHelper.logout(this.state.token)
		this.cookies.set(COOKIE_AUTH_TOKEN, null)
		this.type = 'application/json'
		this.body = JSON.stringify('log out successfully')
	}	catch (err) {
		this.throw(err.message, 500)
	}
}
