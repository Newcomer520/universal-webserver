import { Router } from 'express'
import authenticator from '../middlewares/authenticator'
import authHelper, { COOKIE_AUTH_TOKEN } from '../helpers/server-auth-helper'

/**
 * @api {post} /logout User Logout
 * @apiGroup Authentication
 * @apiName Logout
 *
 * @apiSuccess Response log out successfully
 * @apiSuccessExample {json} Response
 * "log out successfully"
 *
 * @apiError (Error 500) InternalServerError UnexpectedError
 */

const router = new Router()

router.use(authenticator)
router.use((req, res, next) => {
	if (!req.token) {
		next({ message: 'no request token', statusCode: 400 })
	} else {
		next()
	}
})
router.post('/', async (req, res) => {
	try {

		await authHelper.logout(req.token)
		res.clearCookie(COOKIE_AUTH_TOKEN)
		res.status(200).json('log out successfully')
	}	catch (err) {
		let error = new Error(err)
		error.statusCode = 500
		throw error
	}
})

export default router
