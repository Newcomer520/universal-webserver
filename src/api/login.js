import { Router } from 'express'
import crypto from 'crypto'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import { elIp as ip, elPort as port, elTokenDuration as duration, secret  } from '../../config'
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
			const jwtAuth = {
				user: req.body.username,
				secret: result.secret
			}
			const token = jwt.sign(jwtAuth, secret, { expiresIn: '2 days' })
			const ttl = 10 * 60 * 1000
			res.cookie('auth-token', token , { httpOnly: true, maxAge: ttl })
			res.status(result.statusCode).send(JSON.stringify({
				username: req.body.username,
				 expiresIn: new Date(Date.now() + ttl).valueOf()
			}))
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
