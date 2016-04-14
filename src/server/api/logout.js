import router from 'koa-router'
import authenticator from '../middlewares/authenticator'
import authHelper, { COOKIE_AUTH_TOKEN } from '../helpers/server-auth-helper'

/**
 * @api {post} /logout User Logout
 * @apiGroup Authentication
 * @apiName Logout
 *
 * @apiSuccess Response log out successfully
 * @apiSuccessExample {json} Response
 * "log out successfully"
 *
 * @apiError (Error 500) InternalServerError UnexpectedError
 */

const logoutRouter = router()

logoutRouter.use(authenticator)
logoutRouter.use(function *(next) {
	if (!this.state.token) {
		this.throw('no request token', 400)
	}
	yield next
})

logoutRouter.post('/', function *(next) {
	try {

		yield authHelper.logout(this.state.token)
		this.cookies.set(COOKIE_AUTH_TOKEN, null)
		this.type = 'application/json'
		this.body = JSON.stringify('log out successfully')
	}	catch (err) {
		this.throw(err.message, 500)
	}
})

export default logoutRouter
