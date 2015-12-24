import { Router } from 'express'
import crypto from 'crypto'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import authHelper, { COOKIE_AUTH_TOKEN } from '../helpers/server-auth-helper'

const { elIp: ip, elPort: port, elTokenDuration: duration, secret  } = global.config
const es = require('../helpers/elasticsearch')(ip, port)
const loginRouter = new Router()

loginRouter.use(bodyParser.json(), (err, req, res, next) => {
	if (err) {
		res.status(500).send('Something broke!')
		return
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
			const ttl = 10 * 60 * 1000
			const token = authHelper.jwtSign(req.body.username, result.secret, `${ttl} ms`)

			res.cookie(COOKIE_AUTH_TOKEN, token , { httpOnly: true, maxAge: ttl })
			res.status(result.statusCode).json({
				username: req.body.username,
				expiresIn: new Date(Date.now() + ttl).valueOf()
			})
		} catch (err) {
			res.status(err.statusCode).send(err.message)
		}
	}

	// try {
	// 	let responseFromEL = await el.authenticate()
	// }

	// res.cookie('test-cookie', 'cookie-value', { httpOnly: true, expires: new Date(Date.now() + 60000) })
	// res.send('login here')
})


export default loginRouter
