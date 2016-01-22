import originalFetch from 'isomorphic-fetch'
import merge from 'lodash.merge'

export const REFRESH_TOKEN_URL = '/api/refreshtoken'
export const DEFAULT_OPTIONS = { credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }

export const canUseDOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
)

export function login(username, password, gRecaptchaResponse) {
	const url = '/api/login'
	const options = { method: 'post', body: JSON.stringify({ username, password, gRecaptchaResponse })}
	return fetchingObject(url, options, false)
}

export function logout() {
	const url = '/api/logout'
	const options = { method: 'post' }
	return fetchingObject(url, options, false)
}

export function fetchStatus() {
	const url = '/api/status'
	const options = { method: 'get' }
	return fetchingObject(url, options, true)
}

/**
 * return a fetching object
 * @param  {string}    url             url to be visited, localhost limited
 * @param  {object}		 options				 the original fetching options
 * @param  {bool} 	   refreshOnce		 use this flag to determine refreshing token or not if 401 returned
 * @return {object}                    [description]
 */
export default function fetchingObject(url, { ...options, refreshOnce = true }) {
	if (canUseDOM !== true) {
		url = `http://${__HOST__}:${__PORT__}${url}`
	} else {
		// add cookies:
		// https://github.com/github/fetch#sending-cookies
		options = merge({}, DEFAULT_OPTIONS, options)
	}
	return { url, options, refreshOnce }
}

/**
 * the real fetch method
 * @param  {string}  url     url to be visited
 * @param  {object}  options just options
 * @return {Promise} 				 the fetching promise
 */
export function fetch(url, { ...options, token }) {

	if (typeof token === 'string' && token.trim() !== '') {
		options = merge({}, { headers: { Authorization: `Bearer ${token}` } }, options)
	}
	return originalFetch(url, options).then(response => {
		if (response.status >= 200 && response.status < 300) {
			return response
		} else {
			const error = new Error(response.statusText)
			error.response = response
			throw error
		}
	}).then(response => response.json())
}
