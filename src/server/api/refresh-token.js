import router from 'koa-router'
import authHelper, { COOKIE_AUTH_TOKEN, TOKEN_EXPIERED_ERROR, TTL } from '../helpers/server-auth-helper'
import authenticator from '../middlewares/authenticator'
const refreshRouter = router()
/**
 * @api {post} /refreshtoken Refresh Token
 * @apiName RefreshToken
 * @apiGroup Authentication
 *
 * @apiHeader Authorization Optional. One should provide the access token either from Authorization header or Cookie
 * @apiHeaderExample {json} Authorization Header
 * {
 * 	"Authorization": "Bearer 9c507d8d-9c6c-4ba9-87ce-c6af2afd88c6"
 * }
 *
 * @apiParam {String} refreshToken The Refresh Token for generating a pair of new access token and refresh token
 *
 * @apiSuccess {String} refreshToken The new refresh token
 * @apiSuccessExample {json} Response
 * {
 * 	"refreshToken": "9c507d8d-9c6c-4ba9-87ce-c6af2afd88c6"
 * }
 *
 * @apiError (Error 400) MissingRefreshToken <code>refreshToken</code> should be provided.
 * @apiErrorExample {json} MissingRefreshToken
 * HTTP/1.1 400 Bad Request
 * "refresh token should be provided"
 *
 * @apiError (Error 400) MissingAccessToken Access token should be provided.
 * @apiErrorExample {json} MissingAccessToken
 * HTTP/1.1 400 Bad Request
 * "Cannot find access token."
 *
 * @apiError (Error 401) InvalidRefreshToken Refresh token is invalid.
 * @apiErrorExample {json} InvalidRefreshToken
 * HTTP/1.1 401 Bad Request
 * "the refresh token is invalid, please re-login"
 */
refreshRouter.use(authenticator)
refreshRouter.post('/', function *(next) {
	const { request: req } = this
	if (!req.body.refreshToken) {
		this.throw('refresh token should be provided', 400)
	}
	if (!this.state.token) {
		this.throw('cannot find access token', 400)
	}

	const decoded = authHelper.jwtVerify(this.state.token)
	// if signature is valid but not expired time, this kind of token should be passed
	if (decoded.verified !== true && decoded.err.name !== TOKEN_EXPIERED_ERROR) {
		this.throw(decoded.err, 400)
	}
	let parsed = authHelper.jwtDecode(this.state.token)
	console.log('id: ', parsed.jti, 'refresh token:', req.body.refreshToken)
	const isValid = yield authHelper.verifyRefreshToken(parsed.jti, req.body.refreshToken)
	if (isValid !== true) {
		this.throw('the refresh token is invalid, please re-login', 401)
	}
	const { jwt, refreshToken } = yield authHelper.jwtSign(parsed.username, parsed.secret, TTL, parsed.jti)
	console.log('new access token: ', jwt)
	console.log('do not remove right now: ', refreshToken)
	this.cookies.set(COOKIE_AUTH_TOKEN, jwt, { signed: false, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8) })
	this.body = { refreshToken: refreshToken, accessToken: jwt }
})

export default refreshRouter
