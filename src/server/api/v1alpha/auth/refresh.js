import authHelper, { COOKIE_AUTH_TOKEN, TOKEN_EXPIERED_ERROR, TTL } from 'server/helpers/server-auth-helper'

const Refresh = module.exports = function() {}

//TODO how to use apidoc here
Refresh.prototype.jwt = function* (next) {
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
}
