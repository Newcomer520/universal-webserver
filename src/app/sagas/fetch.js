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
      const fetchObjects = (Array.isArray(fetch)? fetch: [fetch])
      const task = yield fork(fetchingTask, [REQUESTING, SUCCESS, FAILURE, CANCELLATION], ...fetchObjects)
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
export function* fetchingTask([REQUESTING, SUCCESS, FAILURE, CANCELLATION], ...fetchObjects) {
  try {
    yield put({ type: TYPES.APP_LOADING, isBusy: true })
    if (REQUESTING) {
      yield put({ type: REQUESTING })
    }

    let authState = yield select(state => state.auth)

    const refreshOnce = canUseDOM && fetchObjects.reduce((prev, curr) => prev || (curr.options && curr.options.refreshOnce), false)
    // the token is possibly expired, try to refresh the token first
    if (refreshOnce && authState.get('tokenValid') && authState.get('expiresIn') < Date.now()) {
      yield call(refreshTokenTask)
    }

    // generate the fetching jobs
    let tasks = fetchObjects
      .filter(fo => fo.url)
      .map(fo => {
        const { url, options } = fo
        return call(decoratedFetch, url, options)
      })
    // fetching task is not the normal way => perform the provided custom task
    const customTasks = fetchObjects
      .filter(fo => fo.customTask && typeof fo.customTask === 'function')
      .map(fo => {
        return call(fo.customTask, fo.options)
      })

    tasks = tasks.concat(customTasks)

    const results = yield tasks
    const reduxResult = results && results.length == 1? results[0]: results
    if (SUCCESS) {
      yield put({ type: SUCCESS, result: reduxResult })
    }
    yield put({ type: TYPES.APP_LOADING, isBusy: false })

    return reduxResult

  } catch (ex) {
    if (!(ex instanceof SagaCancellationException)) {
      if (FAILURE) {
        yield put({ type: FAILURE, message: ex.message, error: ex })
      }
      yield put({ type: TYPES.APP_LOADING, isBusy: false })
      if (canUseDOM && ex.status == 401) {
        const currentUrl = yield select(state => state.routing.locationBeforeTransitions.pathname || '/')
        // only if current location not at /login => redirect to /login
        if (!/^\/login/.test(currentUrl)) {
          yield put({ type: TYPES.AUTH_UNAUTHENTICATED })
        }
      }
      return Promise.reject(ex)
    } else {
      yield put({ type: CANCELLATION, message: ex.message, error: ex })
      yield put({ type: TYPES.APP_LOADING, isBusy: false })
    }
  }

}

function* refreshTokenTask() {
  // @todo refresh token should be from store
  const refreshToken = localStorage.getItem(KEY_REFRESH_TOKEN)
  if (!refreshToken) {
    console.warn('refresh token is null, cannot execute refresh-token task')
    return
  }
  try {
    const url = REFRESH_TOKEN_URL
    const token = yield select(state => state.auth.get('token'))
    const options = {
      ...DEFAULT_OPTIONS,
      method: 'post',
      refreshOnce: false,
      body: JSON.stringify({ refreshToken })
    }
    console.log('start refresh task')
    const { refreshToken: newRefreshToken, accessToken } = yield call(fetch, url, options)
    yield put({ type: REFRESH_TOKEN_DONE, refreshToken: newRefreshToken, accessToken })
  } catch (ex) {
    console.error(`error occurs while refreshing token: ${ex.message}`)
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
    const token = yield select(state => state.auth.get('token'))
    const result = yield call(fetch, url, { ...options, token })
    return result
  } catch (ex) {
    if (canUseDOM && ex.status == 401 && refreshOnce) {
      yield call(refreshTokenTask)
      // after refreshing token, try to request again,
      // if it still fails this time, there should be an error.
      const result = yield call(fetch, url, options)
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
