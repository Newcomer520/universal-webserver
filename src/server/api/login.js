import { Router } from 'express'
import crypto from 'crypto'
import bodyParser from 'body-parser'
import authHelper, { COOKIE_AUTH_TOKEN, TTL } from '../helpers/server-auth-helper'

const { elIp: ip, elPort: port, elTokenDuration: duration, secret  } = global.config
const es = require('../helpers/elasticsearch')(ip, port)
const loginRouter = new Router()

loginRouter.use(bodyParser.json(), (err, req, res, next) => {
	console.log('login api entered')
	if (err) {
		return res.status(500).send('Something broke!')
	}
	next()
})

loginRouter.post('/', async (req, res) => {
	if (!req.body) {
		res.status(400).send('username or password should be provided...')
	} else if (!req.body.username || !req.body.password) {
		res.status(400).send('username or password should be provided.')
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


export default loginRouter
