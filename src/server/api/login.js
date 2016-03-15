import router from 'koa-router'
import crypto from 'crypto'
import bodyParser from 'body-parser'
import authHelper, { COOKIE_AUTH_TOKEN, TTL } from '../helpers/server-auth-helper'
import fetch from 'isomorphic-fetch'

const { secret, recaptchaSecret } = global.config

/**
 * check if the recaptcha is valid
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
function *recaptchaMiddleware(next) {
	const { gRecaptchaResponse } = this.request.body
	if (!gRecaptchaResponse) {
		this.throw('recaptcha response must be provided', 400)
	}
	try {
		const body = JSON.stringify({ secret: recaptchaSecret, response: gRecaptchaResponse })
		const options = { method: 'post' }
		yield fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${gRecaptchaResponse}`, options)
		.then(response => response.json().then(json => {
			if (!json.success) {
				console.log(json)
				this.throw(json.message || 'unable to verify recaptcha', json.status)
			} else {
				return json
			}
		}))
		yield next
	} catch (ex) { // might be thrown from downstream
		this.throw(ex.message || 'invalid recaptcha response', ex.status || 400)
	}
}


/**
 * @api {post} /login User Login
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * @apiParam {String} gRecaptchaResponse Response of google recaptcha
 *
 * @apiSuccess {String} username
 * @apiSuccess {String} refreshToken Refresh token
 * @apiSuccess {number} expiresIn When the access token is expired. In other words, one should use refreshToken to get the new ones
 *
 * @apiSuccessExample {json} Response
 * {
 * 	"username": "user02",
 * 	"refreshToken": "9c507d8d-9c6c-4ba9-87ce-c6af2afd88c6",
 * 	"expiresIn": "2016-01-14T03:18:03.157Z"
 * }
 *
 * @apiError (Error 400) MissingParams The <code>username</code> or <code>password</code> of the User was not provided.
 * @apiErrorExample {json} MissingParams
 * HTTP/1.1 400 Bad Request
 * "username or password should be provided."
 *
 * @apiError (Error 400) InvalidRecaptcha <code>gRecaptchaResponse</code> is either not valid or missed.
 * @apiErrorExample {json} InvalidRecaptcha
 * HTTP/1.1 400 Bad Request
 * "invalid recaptcha response"
 */
const loginRouter = router()
// loginRouter.use(recaptchaMiddleware)
loginRouter.post('/', function *(next) {
	const { request: req, response: res } = this
	if (!req.body || !req.body.username || !req.body.password) {
		this.throw('username or password should be provided...', 401)
	} else {
		try {
			const result = yield authenticate(req.body.username, req.body.password)
			const { jwt, refreshToken } = yield authHelper.jwtSign(req.body.username, result.secret, TTL)
			this.cookies.set(COOKIE_AUTH_TOKEN, jwt, { signed: false, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8) })
			this.body = {
				username: req.body.username,
				refreshToken: refreshToken,
				expiresIn: new Date(Date.now() + TTL)
			}
		} catch (err) {
			this.throw(err.message, err.status || 401)
		}
	}
})

/**
 * pseudo authenticate
 * @param  {[type]} username [description]
 * @param  {[type]} password [description]
 * @return {[type]}          [description]
 */
function authenticate(username, password) {
	return new Promise((resolve, reject) => {
		if ( username !== 'user02' || password !== '123') {
			reject({ message: 'Incorrect username or password', status: 401 })
		} else {
			resolve({ status: 200, mesage: 'login successfully', secret: authHelper.encrypt(password) })
		}
	})
}

export default loginRouter
