import router from 'koa-router'
import authenticator from 'server/middlewares/authenticator'
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
const statusRouter = router()

statusRouter.use(authenticator)
statusRouter.use(function *(next) {
	if (this.state.userInfo.isAuthenticated !== true) {
		this.throw('Unauthenticated', 401)
	}
	yield next
})
statusRouter.get('/', function *(next) {
	try {
		const { state, response: res, request: req } = this
		const { username, password } = state.userInfo
		const healthInfo = yield getStatus(username, password)
		res.body = healthInfo
	}	catch (err) {
		console.log(err)
		this.throw(err.message, err.status)
	}
})

function getStatus(username, password) {
	return new Promise((resolve, reject) => {
		if (username !== 'user02' || password !== '123') {
			reject({ status: 401, message: 'username or password is incorrect'})
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

export default statusRouter
