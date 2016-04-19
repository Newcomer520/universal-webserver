import crypto from 'crypto'
import authHelper, { COOKIE_AUTH_TOKEN, TTL } from 'server/helpers/server-auth-helper'
import fetch from 'isomorphic-fetch'
import passport from 'koa-passport'

const { secret, recaptchaSecret } = global.config

const Login = module.exports = function() {}

//TODO how to use apidoc here
Login.prototype.jwt = function* (next) {
  const ctx = this
  yield passport.authenticate('login', function* (err, user, info) {
    if (err) {
      throw err
    }
    if (user === false) {
      ctx.status = 401
      ctx.cookies.set(COOKIE_AUTH_TOKEN, null)
      ctx.body = { success: false, message: info }
    } else {
      const { accessToken, refreshToken } = authHelper.jwtSign(user.username, user.scope, TTL)
      ctx.cookies.set(COOKIE_AUTH_TOKEN, accessToken, { signed: false }) //, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8)
      ctx.body = { accessToken, refreshToken, username: user.username, expiresIn: Date.now().valueOf() + TTL }
    }
  }).call(this, next)
}
// loginRouter.use(recaptchaMiddleware)
// loginRouter.post('/', function *(next) {

  // const { request: req, response: res } = this
  // if (!req.body || !req.body.username || !req.body.password) {
  //  this.throw('username or password should be provided...', 401)
  // } else {
  //  try {
  //    const result = yield authenticate(req.body.username, req.body.password)
  //    const { jwt, refreshToken } = yield authHelper.jwtSign(req.body.username, result.secret, TTL)
  //    this.cookies.set(COOKIE_AUTH_TOKEN, jwt, { signed: false, /*expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8)*/ })
  //    this.body = {
  //      username: req.body.username,
  //      refreshToken: refreshToken,
  //      expiresIn: new Date(Date.now() + TTL)
  //    }
  //  } catch (err) {
  //    this.throw(err.message, err.status || 401)
  //  }
  // }
// })
