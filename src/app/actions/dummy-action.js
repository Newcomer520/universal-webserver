// import request from 'superagent'
import fetch from '../utils/fetch'

export const TYPES = {
	DUMMY_REQUESTING: Symbol('request dummy'),
	DUMMY_SUCCESS: Symbol('dummy success'),
	DUMMY_FAILED: Symbol('dummy failed')
}


export function dummyApi() {
	return fetch('/api/dummy', {
		method: 'get',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
	// return new Promise((resolve, reject) => {
	// 	request.get('/api/dummy')
	// 		.set('Content-Type', 'application/json')
	// 		.end((err, res) => {
	// 			if (err) {
	// 				reject(err)
	// 			} else {
	// 				resolve(res)
	// 			}
	// 		})
	// })
}

export default function getDummy() {
	const fetch = dummyApi()
	const types = Object.keys(TYPES).map(k => TYPES[k])
	return { fetch, types }
}

/**
 * react-router level fetching data
 * @param  {object} 				store redux store
 * @param  {function}       callback of onEnter
 * @return {array}					types of promise
 */
export function fetchData(dispatch) {
	const result = getDummy()
	dispatch(result)
	return result.types
}
