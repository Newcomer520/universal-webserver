import router from 'koa-router'
import authHelper, { COOKIE_AUTH_TOKEN, TOKEN_EXPIERED_ERROR, TTL } from '../helpers/server-auth-helper'
import authenticator from '../middlewares/authenticator'
import passport from 'koa-passport'

const refreshRouter = new router()
/**
 * @api {post} /refreshtoken Refresh Token
 * @apiName RefreshToken
 * @apiGroup Authentication
 *
 * @apiHeader Authorization Optional. One should provide the access token either from Authorization header or Cookie
 * @apiHeaderExample {json} Authorization Header
 * {
 *  "Authorization": "Bearer 9c507d8d-9c6c-4ba9-87ce-c6af2afd88c6"
 * }
 *
 * @apiParam {String} refreshToken The Refresh Token for generating a pair of new access token and refresh token
 *
 * @apiSuccess {String} refreshToken The new refresh token
 * @apiSuccessExample {json} Response
 * {
 *  "refreshToken": "9c507d8d-9c6c-4ba9-87ce-c6af2afd88c6"
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
refreshRouter.use(passport.authenticate('app', { session: false }))
refreshRouter.post('/', function *(next) {
  const { request: req } = this
  if (!req.body.refreshToken) {
    this.status = 400
    this.body = 'refresh token should be provided'
    return
  }
  const isValid = yield authHelper.verifyRefreshToken(this.req.user.id, req.body.refreshToken)
  if (isValid !== true) {
    this.status = 401
    this.body = 'the refresh token is invalid, please re-login'
    return
  }
  const { accessToken, refreshToken } = yield authHelper.jwtSign(this.req.user.username, this.req.user.scope, TTL)
  this.cookies.set(COOKIE_AUTH_TOKEN, accessToken, { signed: false })
  this.body = { refreshToken: refreshToken, accessToken: accessToken }
})

export default refreshRouter
