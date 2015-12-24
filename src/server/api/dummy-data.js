import { Router } from 'express'
import authenticator from '../middlewares/authenticator'
const dummyRouter = new Router()

let wrap = fn => (...args) => fn(...args).catch(args[2])

dummyRouter.use(authenticator)
dummyRouter.use(async function(req, res) {
	try {
		console.log('for development console: ', req.token)
		const data = await fetchDummyData()
		res.status(200).send(JSON.stringify(data))
	} catch(er) {
		console.log('err')
		res.status(200).json(er)
	}

	// req.promise.then(data => res.status(200).send(JSON.stringify(data)))
	// fetchDummyData().then(
	// 	result => res.status(200).send(JSON.stringify(result))
	// )
})

export function fetchDummyData() {
	// return new Promise((resolve, reject) => {
	// fetch('//offline-news-api.herokuapp.com/stories')
 //    .then(function(response) {
 //        if (response.status >= 400) {
 //            // throw new Error("Bad response from server");
 //            reject('bad responsessss')
 //        }
 //        return response.json();
 //    })
 //    .then(function(stories) {
 //        resolve(stories)
 //    })
	// })
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const ret = []
			for (let i = 0; i < 20; i++ ) {
				ret.push({ id: i, value: Math.random() })
			}
			resolve(ret)
		}, 3000)
	})
}
export default dummyRouter
