import { SagaCancellationException } from 'redux-saga'
import { put, take, call, fork, cancel, select } from 'redux-saga/effects'
import TYPES from 'constants/action-types'
import CONSTANTS from 'constants'

import {
	fetch,
	DEFAULT_OPTIONS,
	canUseDOM, } from '../utils/fetch'

const { SAGA_FETCH_ACTION, SAGA_PRELOAD_ACTION, REFRESH_TOKEN_DONE } = TYPES
const { KEY_REFRESH_TOKEN, REFRESH_TOKEN_URL } = CONSTANTS

export function* fetchSaga() {
	while (true) {
		try {
			const {
				fetch,
				status: [REQUESTING = 'NULL_REQUESTING', SUCCESS = 'NULL_SUCCESS', FAILURE = 'NULL_FAILURE', CANCELLATION]
			} = yield take(SAGA_FETCH_ACTION)
			console.log('capture fetch in fetch saga')
			// check if token exist, if so, attach token to the option
			const authState = yield select(state => state.auth)
			const fetchObjects = (Array.isArray(fetch)? fetch: [fetch]).map(fo => ({ token: authState.token, ...fo }) )
			const task = yield fork(fetchingTask, authState, [REQUESTING, SUCCESS, FAILURE, CANCELLATION], ...fetchObjects)
			if (CANCELLATION) {
				yield take(CANCELLATION)
				yield cancel(task)
			}
		} catch (ex) {
			console.error(ex)
		}
	}
}

/**
 * [*fetchingTask description]
 * @param {[type]}    [REQUESTING   [description] \
 * @param {[type]}    SUCCESS       [description]  \  these are status, for the status of fetcching
 * @param {[type]}    FAILURE       [description]  /
 * @param {[type]}    CANCELLATION] [description] /
 * @param {...[type]} fetchObjects  dynamic fetching, if so => fetching in parallel
 * @yield {[type]}    [description]
 */
export function* fetchingTask(authState = {}, [REQUESTING, SUCCESS, FAILURE, CANCELLATION], ...fetchObjects) {
	try {
		yield put({ type: TYPES.APP_LOADING, isBusy: true })
		yield put({ type: REQUESTING })
		// generate the fetching jobs
		const tasks = fetchObjects.map(fo => {
			const { url, options } = fo
			return call(decoratedFetch, url, options)
		})

		const refreshOnce = canUseDOM && fetchObjects.reduce((prev, curr) => prev || (curr.options && curr.options.refreshOnce), false)

		// the token is possibly expired, try to refresh the token first
		if (refreshOnce && authState.tokenValid && authState.expiresIn < Date.now()) {
			yield call(refreshTokenTask)
		}

		const results = yield tasks
		console.log(results)
		const reduxResult = results && results.length == 1? results[0]: results
		yield put({ type: SUCCESS, result: reduxResult })
		yield put({ type: TYPES.APP_LOADING, isBusy: false })
		return reduxResult

	}	catch (ex) {
		console.error(ex)
		if (!(ex instanceof SagaCancellationException)) {
			yield put({ type: FAILURE, message: ex.message, error: ex })
			return Promise.reject(ex)
		} else {
			yield put({ type: CANCELLATION, message: ex.message, error: ex })
		}
		yield put({ type: TYPES.APP_LOADING, isBusy: false })
	}

}

function* refreshTokenTask() {
	const refreshToken = localStorage.getItem(KEY_REFRESH_TOKEN)
	if (!refreshToken) {
		console.warn('refresh token is null, cannot execute refresh-token task')
		return
	}
	try {
		const url = REFRESH_TOKEN_URL
		const options = {
			...DEFAULT_OPTIONS,
			method: 'post',
			refreshOnce: false,
			body: JSON.stringify({ refreshToken })
		}
		console.log('start refresh task')
		const { refreshToken: newRefreshToken } = yield call(fetch, url, options)
		yield put({ type: REFRESH_TOKEN_DONE, newToken: newRefreshToken })
	} catch (ex) {
		console.error(`error occurs while refreshing token: ${ex.message}`)
		console.error(ex)
		return Promise.reject(ex)
	}
}

/**
 * decorated fetch, will try to refresh the token
 * if refreshOnce equals true and the first request gets 401 response
 *
 * @param  {[type]}    url                 [description]
 * @param  {Boolean}   options.refreshOnce [description]
 * @param  {...[type]} options.options      [description]
 * @return {[type]}                        [description]
 */

function* decoratedFetch(url, { refreshOnce, ...options } ) {
	try {
		const result = yield call(fetch, url, options)
		return result
	} catch (ex) {
		if (canUseDOM && ex.status == 401 && refreshOnce) {
			yield call(refreshTokenTask)
			// after refreshing token, try to request again,
			// if it still fails this time, there should be an error.
			const result = yield call(fetch, url, options, transform)
			return result
		}
		// cannot throw error!! user Promise.reject instead
		return Promise.reject(ex)
	}
}

export function* preloaderSaga() {
	let previousLoaders = []
	while (true) {
		const { preloaders, params } = yield take(SAGA_PRELOAD_ACTION)
		console.log('preloaderSaga')
		if (!preloaders || !Array.isArray(preloaders)) {
			console.warn('preloaders should be of array')
			continue
		}
		const needToFetch = preloaders
			.filter(pl => previousLoaders.indexOf(pl) == -1)
			.map(pl => call(putTask, pl, params))
		// console.log(needToFetch, preloaders)
		// ensure that rendering is done first
		yield delay(1)
		yield needToFetch
		previousLoaders = preloaders
	}
}

export const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms || 0))

function* putTask(preloader, params) {
	yield put(preloader(params))
}
