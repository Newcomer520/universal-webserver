import React from 'react'
import { RouterContext } from 'react-router'
import { fetchingTask } from 'sagas/fetch'
import { sagaMiddleware } from 'app/create-store'
import { call, put, take, fork } from 'redux-saga/effects'
import { Provider } from 'react-redux'
import merge from 'lodash.merge'
import { canUseDOM } from './fetch'
import { enableFetchAtBrowser } from 'actions/universal-action'
import TYPES from 'constants/action-types'

const { SAGA_PRELOAD_ACTION } = TYPES

export function findPreloaderTasks(authState, components, params, options) {
	return components
		.filter(c => c && c.preloader)
		.map(c => {
			let tasks = []
			if (typeof c.preloader === 'function') {
				let task = makeFetchingTask(authState, c.preloader(params), options) // c.preloader() should be like: { fetch, status }
				tasks.push(task)
			} else if (Array.isArray(c.preloader)) {
				c.preloader.forEach(pl => {
					let task = makeFetchingTask(authState, pl(params), options)
					tasks.push(task)
				})
			}
			return tasks
		})
		.reduce((result, preloader) => result.concat(preloader), [])
}

function makeFetchingTask(authState, { status, fetch }, options) { // fetch is like: { url, options }
	const [REQUESTING, SUCCESS, FAILURE, CANCELLATION] = status
	// feed the token
	if (Array.isArray(fetch)) {
		fetch = fetch.map(f => merge({}, fetch, { options }))
	} else if (typeof fetch === 'object') {
		fetch = [merge({}, fetch, { options })]
	} else {
		return console.log('should not go here in makeFetchingTask')
	}
	status = canUseDOM?
		['client' + REQUESTING, SUCCESS, 'client' + FAILURE, CANCELLATION]
		:
		['server' + REQUESTING, SUCCESS, 'server' + FAILURE, CANCELLATION]
	return call(fetchingTask, authState, status, ...fetch)
}

let previousLoaders = []

/**
 * overwrite the default render function of Router
 * @param  {[type]} props [description]
 * @return {[type]}       [description]
 */
export const renderRouterContext = (store) => (props) => {
	if (!canUseDOM) {
		return <RouterContext {...props}/>
	} else if (!store.getState().universal.fetchAtBrowser) { //data fetched at server side
		// reset the flag of fetchAtBrowser
		store.dispatch(enableFetchAtBrowser())
		return <RouterContext {...props}/>
	}

	// failed to fetch data at server side, need to fetch data at browser
	const authState = store.getState().auth
	const currentLoaders = props.components
		.filter(c => c && c.preloader)
		.map(c => {
			let loaders = []
			if (typeof c.preloader === 'function') {
				loaders.push(c.preloader)
				// preloaders.push(c.preloader(props.params))
			} else if (Array.isArray(c.preloader)) {
				// c.preloader.forEach(pl => preloaders.push(pl(props.params)))
				c.preloader.forEach(pl => preloaders.push(pl))
			}
			return loaders
		})
		.reduce((result, preloaders) => result.concat(preloaders), [])
	const needToFetch = currentLoaders
		.filter(l => previousLoaders.indexOf(l) == -1)
		.map(l => l(props.params))
	if (needToFetch.length > 0) {
		previousLoaders = currentLoaders
		// must ensure component do rendering first, any better way?
		setTimeout(() => needToFetch.forEach(pl => store.dispatch(pl)), 0)
	}
	return <RouterContext {...props}/>
}
