import { Router } from 'express'
import crypto from 'crypto'
import bodyParser from 'body-parser'
import authHelper, { COOKIE_AUTH_TOKEN, TTL } from '../helpers/server-auth-helper'
import fetch from 'isomorphic-fetch'

const { elIp: ip, elPort: port, elTokenDuration: duration, secret, recaptchaSecret } = global.config
const es = require('../helpers/elasticsearch')(ip, port)
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
const loginRouter = new Router()

loginRouter.use(bodyParser.json(), (err, req, res, next) => {
	if (err) {
		return next({ statusCode: 500, message: 'failed to parse body' })
	}
	next()
})
loginRouter.use(recaptchaMiddleware)
loginRouter.post('/', async (req, res) => {
	if (!req.body) {
		res.status(400).json('username or password should be provided...')
	} else if (!req.body.username || !req.body.password) {
		res.status(400).json('username or password should be provided.')
	} else {
		try {
			const result = await es.authenticate(req.body.username, req.body.password)
			const { jwt, refreshToken } = await authHelper.jwtSign(req.body.username, result.secret, TTL)
			res.cookie(COOKIE_AUTH_TOKEN, jwt, { httpOnly: true, maxAge: 8 * 24 * 60 * 60 * 1000 })
			res.status(result.statusCode).json({
				username: req.body.username,
				refreshToken: refreshToken,
				expiresIn: new Date(Date.now() + TTL)
			})
		} catch (err) {
			res.status(err.statusCode).json(err)
		}
	}
})

/**
 * check if the recaptcha is valid
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
async function recaptchaMiddleware(req, res, next) {
	const { gRecaptchaResponse } = req.body
	if (!gRecaptchaResponse) {
		return next({ statusCode: 400, message: 'recaptcha response must be provided'})
	}
	try {
		const body = JSON.stringify({ secret: recaptchaSecret, response: gRecaptchaResponse })
		const options = { method: 'post' }
		console.log(options)
		await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${gRecaptchaResponse}`, options)
		.then(response => response.json().then(json => {
			if (!json.success) {
				throw json
			} else {
				return json
			}
		}))
		next()
	} catch (err) {
		console.log(err)
		next({ statusCode: 400, message: 'invalid recaptcha response' })
	}
}
export default loginRouter
