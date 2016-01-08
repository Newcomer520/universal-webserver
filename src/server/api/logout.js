import { Router } from 'express'
import { COOKIE_AUTH_TOKEN } from '../helpers/server-auth-helper'

const router = new Router()
router.post('/', (req, res) => {
	res.clearCookie(COOKIE_AUTH_TOKEN)
	res.status(200).json('log out successfully')
})

export default router
