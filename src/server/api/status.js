import { Router } from 'express'
import authenticator from '../middlewares/authenticator'
const { elIp: ip, elPort: port, elTokenDuration: duration, secret  } = global.config
const es = require('../helpers/elasticsearch')(ip, port)
const router = new Router()

router.use(authenticator)
router.use((req, res, next) => {
	// console.log('req midd', req.userInfo)
	if (req.userInfo.isAuthenticated !== true) {
		const err = new Error('Unauthenticated')
		err.statusCode = 401
		next(err)
	} else {
		next()
	}
})
router.get('/', async (req, res) => {
	try {
		const { username, password } = req.userInfo
		const healthInfo = await es.getStatus(username, password)
		res.status(200).json(healthInfo)
	}	catch (err) {
		console.log(err)
		throw err
	}
})

export default router
