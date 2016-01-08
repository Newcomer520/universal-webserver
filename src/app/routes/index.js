import React, { Component } from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import { replacePath, pushPath } from 'redux-simple-router'
// components
import Root from 'components/Root'
import FetchStatus from 'components/FetchStatus'
import Login from 'components/Login'

import { setFetched } from 'actions/fetch-action'
import getDummy from 'actions/dummy-action'
import AuthViewRoute from './auth-view-route'
import { canUseDOM } from '../utils/fetch'

/**
 * for rendering at server side, we might pass the information of token in order to fetch data
 * @param  {object} store redux store
 * @param  {string} token which only be passed by server currently
 * @return {object} a react-router structure
 */
export default (store) => {
	return (
		<Route path="/" component={ Root }>
			<IndexRoute component={ FetchStatus } onEnter={ requireLogin(store) } />
			<Route path="login" component={ Login } />
		</Route>
	)
}

export const requireLogin = store => (nextState, replaceState, cb) => {
	const { auth } = store.getState()
	if (auth.tokenValid === true && auth.tokenExpired === true) {
		replaceState(null, 'login', { to: nextState.location.pathname })
		cb()
	} else if (auth.isAuthenticated !== true) {
		// oops, not logged in, so can't be here!
		replaceState(null, 'login', { to: nextState.location.pathname })
		cb()
	} else {
		cb()
	}
}

export const requireFetch = (fetchMethod, { authRequired = false, store, reduxState, status = 'status' }, ...args) => {
	return (nextState, replaceState, cb) => {
		const { auth } = store.getState()
		if (!canUseDOM && authRequired === true) {
			if (auth.tokenValid && auth.tokenExpired) {
				// at server side, if not authenticated, dont fetch the data
				return cb()
			} else if (auth.isAuthenticated === false) {
				// not authenticated nor token valid
				replaceState(null, 'login', { to: nextState.location.pathname })
			} else if (store.getState().fetched === true) {
				return cb()
			}
		} else if (canUseDOM){ //environment === browser
			if (store.getState().fetched === true) { // fetched already
				return cb()
			} else {
				console.log('render view without waiting for fetching data')
				cb()
			}
		}
		const result = fetchMethod(...args)
		store.dispatch(result)
		store.dispatch(setFetched(true))
		const { types: [ REQUESTING, REQ_SUCCESS, REQ_FAILED ] } = result
		const unsubscribe = store.subscribe(() => {
			if (store.getState()[reduxState][status] === REQ_SUCCESS
				|| store.getState()[reduxState][status] === REQ_FAILED) {
				unsubscribe()
				if (!canUseDOM) {
					console.log('server side fetching data')
					cb()
				}
			}
		})

	}
}

