import { Router } from 'express'
import authenticator from '../middlewares/authenticator'
const router = new Router()

let wrap = fn => (...args) => fn(...args).catch(args[2])

router.use(authenticator)
router.use((req, res, next) => {
	if (req.userInfo.isAuthenticated === false) {
		res.status(401).send("Unauthenticated")
	} else {
		next()
	}
})
router.get('/', async function(req, res) {
	try {
		const data = await fetchDummyData()
		res.status(200).send(JSON.stringify(data))
	} catch(er) {
		console.log('err')
		res.status(200).json(er)
	}
})

export function fetchDummyData() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const ret = []
			for (let i = 0; i < 20; i++ ) {
				ret.push({ id: i, value: Math.random() })
			}
			resolve(ret)
		}, 100)
	})
}
export default router
