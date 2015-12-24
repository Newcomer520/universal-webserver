import { login as loginApi } from '../utils/fetch'
import request from 'superagent'
export const TYPES = {
	LOGIN_REQUESTING: Symbol('request login'),
	LOGIN_SUCCESS: Symbol('login success'),
	LOGIN_FAILED: Symbol('login failed')
}

/**
 * [apiLogin description]
 * @return {Promise} return the promise of posting '/login'
 */
// function apiLogin(username, password) {
// 	return new Promise((resolve, reject) => {
// 		request.post('/api/login')
// 			.set('Content-Type', 'application/json')
// 			.send({ username: username, password: password })
// 			.end((err, res) => {
// 				if (err) {
// 					reject(err)
// 				} else {
// 					resolve(res)
// 				}
// 			})
// 	})
// }


export function login(username, password) {
	// const promise = apiLogin(username, password)
	const fetch = loginApi(username, password)
	const types = Object.keys(TYPES).map(k => TYPES[k])
	return { fetch, types }
}
