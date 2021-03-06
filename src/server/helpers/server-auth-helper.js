/**
 * server side 相關的認證function
 */
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import uuid from 'node-uuid'
import { initState as authInitState } from 'reducers/auth-reducer'
const { secret, privateKey, publicKey, refreshTokenKey } = global.config
const algorithm = 'aes-256-ctr' // alogorithm for encrypting password, NOT for jwt
export const COOKIE_AUTH_TOKEN = 'auth-token'
export const TOKEN_EXPIERED_ERROR = 'TokenExpiredError'
export const TTL = 10 * 60 * 1000 // the lifetime of json web token: min * sec * milli-secs

// @todo: remove the redis completely
export default class authHelper {
  static recoverToken(token) {
    let state = { ...authInitState }
    if (!token || token === '') {
      return state
    }
    let decoded = authHelper.jwtVerify(token)
    if (decoded.verified !== true) {
      if (decoded.err.name !== TOKEN_EXPIERED_ERROR) {
        return state
      } else {
        // the jwt is still valid although it is expired
        return { ...state, tokenExpired: true, tokenValid: true }
      }
    }

    state = {
      ...state,
      isAuthenticated: Date.now().valueOf() <= decoded.exp * 1000,
      username: decoded.username,
      // password: authHelper.decrypt(decoded.secret),
      expiresIn: decoded.exp * 1000,
      startAt: decoded.iat * 1000,
      tokenExpired: false,
      tokenValid: true
    }
    return state
  }
  // static async jwtSign(username, encryptedPassword, ttlMS, oldJti) {
  static jwtSign(username, scope, ttlMS) {
    const jwtObject = {
      username,
      scope,
      jti: uuid.v4(),
    }
    // const refreshToken = uuid.v4()

    try {
      // oldJti && typeof oldJti === 'string' && await redisClient.del(oldJti)
      // await redisClient.set(jwtObject.jti, refreshToken)
      // await redisClient.expire(jwtObject.jti, 60 * 60 * 24 * 7) // 7 days
    } catch (err) {
      err.status = 500
      throw err
    }
    return {
      accessToken: jwt.sign(jwtObject, privateKey, { expiresIn: `${ttlMS} ms`, algorithm: 'RS256' }),
      refreshToken: jwt.sign({}, authHelper.prefixRefresTokenKey(jwtObject.jti) + refreshTokenKey, { algorithm: 'HS256' }),
    }
  }

  static jwtVerify(token) {
    let decoded = { verified: false }
    try {
      const options = { algorithms: ['RS256'] }
      decoded = Object.assign(jwt.verify(token, publicKey, options), { verified: true })
    } catch(err) {
      decoded.err = err
    }
    return decoded
  }

  static jwtDecode(token, ...what) {
    const decoded = jwt.decode(token)
    what = what.length == 0? Object.keys(decoded): what
    const ret = {}
    what.forEach(p => ret[p] = decoded[p])
    return ret
  }

  static prefixRefresTokenKey(jti) {
    return jti.substring(5, 12)
  }

  static async verifyRefreshToken(jti, refreshToken) {
    const options = { algorithms: ['HS256'] }

    try {
      jwt.verify(refreshToken, authHelper.prefixRefresTokenKey(jti) + refreshTokenKey, options)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
  // static encrypt(text) {
  //  const cipher = crypto.createCipher(algorithm, secret)
  //  let crypted = cipher.update(text, 'utf8', 'hex')
  //  crypted += cipher.final('hex')
  //  return crypted
  // }
  // static decrypt(text) {
  //  const decipher = crypto.createDecipher(algorithm, secret)
  //  let dec = decipher.update(text, 'hex', 'utf8')
  //  dec += decipher.final('utf8')
  //  return dec
  // }
  static async logout(token = '') {
    let decoded = authHelper.jwtDecode(token)
    // await redisClient.del(decoded.jti)
    console.log('delete jti: ', decoded.jti)
  }
}
