import originalFetch from 'isomorphic-fetch'
import merge from 'lodash.merge'
import CONSTANTS from 'constants'
import TYPES from 'constants/action-types'

const { KEY_REFRESH_TOKEN } = CONSTANTS
const { SAGA_FETCH_ACTION, SAGA_PRELOAD_ACTION, REFRESH_TOKEN_DONE } = TYPES
const { REFRESH_TOKEN_URL } = CONSTANTS

export const DEFAULT_OPTIONS = { credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }

export const canUseDOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
)

export function login(username, password, gRecaptchaResponse) {
  const url = '/api/login'
  const options = { method: 'post', body: JSON.stringify({ username, password, gRecaptchaResponse }), refreshOnce: false }
  return fetchObj(url, options)
}

export function logout() {
  const url = '/api/logout'
  const options = { method: 'post', refreshOnce: false }
  return fetchObj(url, options)
}

export function fetchStatus() {
  const url = '/api/status'
  const options = { method: 'get' }
  return fetchObj(url, options)
}

/**
 * return a fetching object, arguments are set the same as the offical fetch: url and options
 * @param  {[type]}    url                 url to be visited, localhost limited
 * @param  {Boolean}   options.refreshOnce use this flag to determine to refresh the token or not if 401 returned
 * @param  {...[type]} options.options     the original fetching options
 * @return {[type]}                        [description]
 */
export default function fetchObj(url, { refreshOnce = true, transform = 'json', ...options} ) {
  if (!canUseDOM) {
    url = `http://${__HOST__}:${__PORT__}${url}`
    options = { ...options, transform }
  } else {
    // add cookies:
    // https://github.com/github/fetch#sending-cookies
    options = merge({}, DEFAULT_OPTIONS, { refreshOnce, transform }, options)
  }
  return { url, options }
}

/**
 * the real fetch method
 * @param  {[type]}    url             url to be visited
 * @param  {...[type]} options.options fetching options
 * @param  {[type]}    options.token   if provided, it will be injected as Authorization Bearer of Header
 * @param  {[type]}    options.refreshOnce   should fetch need to refresh the token once while the response of 401,
 *                                           refreshing should not be done here
 * @return {[type]}                    the fetching promise
 */
export function fetch(url, { token, refreshOnce, transform = 'json', ...options }) {
  if (typeof token === 'string' && token.trim() !== '') {
    options = merge({}, { headers: { Authorization: `Bearer ${token}` } }, options)
  }

  const promise = originalFetch(url, options)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response
      } else {
        const error = new Error(response.statusText)
        error.status = response.status
        error.response = response
        throw error
      }
    })
    .catch(err => errorTransform(err.response, 'text'))

    return typeof transform === 'string'
    ? promise.then(result => result[transform]())
    : typeof transform === 'function'
    ? promise.then(transform)
    : promise
}

/**
 * handle the returned error of requesting promise. will try to resolve the error message
 * @param  {[type]} res       [description]
 * @param  {String} transform might be 'string' or 'json' currently
 * @return {[type]}           [description]
 */
function errorTransform(res, transform = 'json') {
  if (typeof res[transform] !== 'function') {
    const err = new Error(res.statusText)
    err.response = res
    err.status = res.status
    throw err
  }
  return res[transform]().then(t => {
    const err = new Error(t)
    err.response = res
    err.status = res.status
    throw err
  })
}
