import React, { Component } from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import { replacePath, pushPath } from 'redux-simple-router'
// components
import Root from 'components/Root'
import FetchStatus from 'components/FetchStatus'
import Login from 'components/Login'

import { setFetched } from 'actions/fetch-action'
import { canUseDOM } from '../utils/fetch'
import { fetchStatus } from 'actions/fetch-status-action'

import Rx from 'rx'
import { observableFromStore } from 'redux-rx'

/**
 * for rendering at server side, we might pass the information of token in order to fetch data
 * @param  {object} store redux store
 * @param  {string} token which only be passed by server currently
 * @return {object} a react-router structure
 */
export default (store) => {
	return (
		<Route path="/" component={ Root }>
			<IndexRoute component={FetchStatus} onEnter={requireFetch(fetchStatus, { authRequired: true, store, reduxState: 'fetchStatus', status: 'status' })} />
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
		const state$ = observableFromStore(store).startWith(store.getState()).map(state => ({ canUseDOM, authRequired, reduxState, status, ...state })) // provide the other information
		// unauthenticated => redirect to login
		state$.filter(s => s.authRequired && !s.auth.tokenValid).first().subscribe(state => replaceState(null, 'login', { to: nextState.location.pathname }))
		// when to render the view
		state$.filter(s => s.fetched || s.canUseDOM || (s.auth.tokenValid && s.auth.tokenExpired)).first().subscribe(state => cb())

		const needFetch$ = state$.filter(s => s.fetched? false: s.canUseDOM || s.auth.isAuthenticated).map(s => ({ fetchingObject: fetchMethod(...args), ...s })) //add the fetching object
		needFetch$
			.first()
			.delay(1) //to ensure the consistence in client / server
			.subscribe(state => store.dispatch(state.fetchingObject))
		needFetch$
			.distinctUntilChanged(s => s[reduxState][status])
			.subscribe(state => {
				const { types: [REQUESTING, REQ_SUCCESS, REQ_FAILED] } = state.fetchingObject
				switch (state[reduxState][status]) {
					case REQ_SUCCESS:
						store.dispatch(setFetched(true))
						break
				}
			})
	}
}

