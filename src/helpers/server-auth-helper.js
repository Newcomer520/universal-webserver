/**
 * server side 相關的認證function
 */
import crypto from 'crypto'
import { secret } from '../../config'
import jwt from 'jsonwebtoken'

const algorithm = 'aes-256-ctr'
export const COOKIE_AUTH_TOKEN = 'auth-token'

export default class authHelper {
	static recoverToken(cookies) {
		let state = {
			isAuthenticated: false,
			username: null,
			expiresIn: null
		}
		if (!cookies[COOKIE_AUTH_TOKEN] || cookies[COOKIE_AUTH_TOKEN] === '') {
			return state
		}
		const decoded = authHelper.jwtVerify(cookies.token)
		if (decoded.verified !== true) {
			return state
		}
		state = {
			isAuthenticated: Date.now().valueOf() <= decoded.expiresIn,
			username: decoded.username,
			password: authHelper.decrypt(decoded.secret),
			expiresIn: decoded.exp
		}

	}
	static jwtSign(username, encryptedPassword, ttl) {
		const jwtObject = {
			username: username,
			secret: encryptedPassword
		}
		return jwt.sign(jwtObject, secret, { expiresIn: ttl })
	}
	static jwtVerify(token) {
		let decoded	= { verified: false }
		try {
			decoded = Object.assign(jwt.verify(token, secret), { verified: true })
		} catch(err) {
			decoded.err = err
		}
		return decoded
	}
	static encrypt(text) {
		const cipher = crypto.createCipher(algorithm, secret)
		let crypted = cipher.update(text, 'utf8', 'hex')
		crypted += cipher.final('hex')
		return crypted
	}
	static decrypt(text) {
		const decipher = crypto.createDecipher(algorithm, config.secret)
		let dec = decipher.update(text, 'hex', 'utf8')
		dec += decipher.final('utf8')
		return dec
	}
}
