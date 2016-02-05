import { Router } from 'express'
import authenticator from '../middlewares/authenticator'
const { secret } = global.config

/**
 * @apiDefine Admin Accessed only by administrator.
 *
 */

/**
 * @api {get} /status Status
 * @apiGroup Elasticsearch
 * @apiName GetStatus
 *
 * @apiPermission Admin
 * @apiSuccessExample {json} Response
 * {
 * 	"cluster_name" : "security-el",
 * 	"status" : "green",
 * 	"timed_out" : false,
 * 	"number_of_nodes" : 1,
 * 	"number_of_data_nodes" : 1,
 * 	"active_primary_shards" : 0,
 * 	"active_shards" : 0,
 * 	"relocating_shards" : 0,
 * 	"initializing_shards" : 0,
 * 	"unassigned_shards" : 0,
 * 	"delayed_unassigned_shards" : 0,
 * 	"number_of_pending_tasks" : 0,
 * 	"number_of_in_flight_fetch" : 0
 * }
 *
 * @apiError (Error 400) Unauthorized User has no permission to access the resource
 * @apiErrorExample {json} Unauthorized
 * HTTP/1.1 401 Unauthorized
 * "Unauthenticated"
 *
 */
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
		const healthInfo = await getStatus(username, password)
		res.status(200).json(healthInfo)
	}	catch (err) {
		console.log(err)
		throw err
	}
})

function getStatus(username, password) {
	return new Promise((resolve, reject) => {
		if (username !== 'user02' || password !== '123') {
			reject({ statusCode: 401, message: 'username or password is incorrect'})
		} else {
			resolve({
				"cluster_name" : "security-el",
				"status" : "green",
				"timed_out" : false,
				"number_of_nodes" : 1,
				"number_of_data_nodes" : 1,
				"active_primary_shards" : 0,
				"active_shards" : 0,
				"relocating_shards" : 0,
				"initializing_shards" : 0,
				"unassigned_shards" : 0,
				"delayed_unassigned_shards" : 0,
				"number_of_pending_tasks" : 0,
				"number_of_in_flight_fetch" : 0
			})
		}
	})
}

export default router
