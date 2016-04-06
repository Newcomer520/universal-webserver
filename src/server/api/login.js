import router from 'koa-router'
import crypto from 'crypto'
import authHelper, { COOKIE_AUTH_TOKEN, TTL } from '../helpers/server-auth-helper'
import fetch from 'isomorphic-fetch'
import passport from 'koa-passport'

const { secret, recaptchaSecret } = global.config

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
 *  "username": "user02",
 *  "refreshToken": "9c507d8d-9c6c-4ba9-87ce-c6af2afd88c6",
 *  "expiresIn": "2016-01-14T03:18:03.157Z"
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
loginRouter.post('/', function* (next) {
  const ctx = this
  ctx.cookies.set(COOKIE_AUTH_TOKEN, undefined)
  console.log(COOKIE_AUTH_TOKEN, '123333',ctx.cookies.get(COOKIE_AUTH_TOKEN))
  yield passport.authenticate('login-local', function* (err, user, info) {
    if (err) {
      throw err
    }

    if (user === false) {
      ctx.status = 401
      ctx.body = { success: false, message: info }
    } else {
      const { accessToken, refreshToken } = authHelper.jwtSign(user.username, user.permissions, TTL)
      ctx.cookies.set(COOKIE_AUTH_TOKEN, accessToken, { signed: false }) //, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8)
      ctx.body = { accessToken, refreshToken }
    }

  }).call(this, next)
})
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

export default loginRouter
