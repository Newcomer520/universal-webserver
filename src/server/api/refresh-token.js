import { Router } from 'express'
import bodyParser from 'body-parser'
import authHelper, { COOKIE_AUTH_TOKEN, TOKEN_EXPIERED_ERROR, TTL } from '../helpers/server-auth-helper'
import authenticator from '../middlewares/authenticator'
const refreshRouter = new Router()
refreshRouter.use(authenticator)
refreshRouter.use(bodyParser.json(), (err, req, res, next) => {
	if (err) {
		return res.status(500).send('json parsing failed!')
	}
	next()
})
refreshRouter.post('/', async (req, res) => {
	if (!req.body.refreshToken) {
		return res.status(400).json('refresh token should be provided')
	}
	if (!req.token) {
		return res.status(400).json('Cannot find access token.')
	}
	const decoded = authHelper.jwtVerify(req.token)
	// if signature is valid but not expired time, this kind of token should be passed
	if (decoded.verified !== true && decoded.err.name !== TOKEN_EXPIERED_ERROR) {
		return res.status(400).json(decoded.err)
		// return res.status(400).json({ message: 'access token is invalid.' })
	}
	let parsed = authHelper.jwtDecode(req.token)
	console.log(parsed.jti, req.body.refreshToken)
	const isValid = await authHelper.verifyRefreshToken(parsed.jti, req.body.refreshToken)
	if (isValid !== true) {
		// return res.status(401).json({ message: 'the refresh token is invalid, please re-login' })
		return res.status(401).json('the refresh token is invalid, please re-login')
	}
	const { jwt, refreshToken } = await authHelper.jwtSign(parsed.username, parsed.secret, TTL, parsed.jti)
	console.log('do not remove right now: ', refreshToken)
	res.cookie(COOKIE_AUTH_TOKEN, jwt, { httpOnly: true, maxAge: 8 * 24 * 60 * 60 * 1000 })
	res.status(200).json({ refreshToken })
})

export default refreshRouter
