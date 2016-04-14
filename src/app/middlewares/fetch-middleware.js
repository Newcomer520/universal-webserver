import { fetch as defaultFetch, REFRESH_TOKEN_URL, DEFAULT_OPTIONS } from '../utils/fetch'
import { DATA_FETCHED, REFRESH_TOKEN_DONE } from 'actions/fetch-action'
import merge from 'lodash.merge'

export default function (store) {
	return next => action => {

		if (!action) {
			return
		}

		if (!action.fetch) {
			return next(action)
		}

		let { fetch: { url, options, refreshOnce }, types, ...rest }	= action
		if (!url || !types) {
			return next(action)
		}

		// pass the access token if necessary
		options = { ...options, token: store.getState().auth.token }
		console.log('fetch middleware....')
		const fetched = defaultFetch(url, options)
		const promise = fetched.catch(
			err => {
				const refreshToken = store.getState().auth.refreshToken
				if (err.response.status === 401 && refreshToken && refreshOnce === true) {
					console.log('try to refresh token...')
					return defaultFetch(REFRESH_TOKEN_URL, merge({}, DEFAULT_OPTIONS, { method: 'post', body: JSON.stringify({ refreshToken: refreshToken }) }))
						.then(
							res => {
								next({ type: REFRESH_TOKEN_DONE, newToken: res.refreshToken })
								// refresh token success
								// re-request again
								// this time wont try to run refreshing token if got 401
								return defaultFetch(url, options)
							}
						).catch(
							err => err.response.json().then(json => {
								// even failed to refresh token => redirect to login?
								throw json
							})
						)
				} else {
					console.log('request failed and no doing refresh token', err.response)
					return err.response.json().then(json => { throw json })
				}
			}
		)
		// next({ type: FETCH_PROMISE, promise })
		// convert to the promise
		return next({
			promise,
			types,
			...rest
		})
	}
}
