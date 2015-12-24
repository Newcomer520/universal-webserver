import React, { Component } from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import { replacePath, pushPath } from 'redux-simple-router'
import Home from 'components/Home'
import App from 'components/App'
import About from 'components/About'
import Contact from 'components/Contact'
import DLogin from 'components/DLogin'
import DFetch from 'components/DFetch'
import { setFetched } from 'actions/fetch-action'
import getDummy from 'actions/dummy-action'
import FLogin from 'components/FLogin'
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
		<Route path="/">
			<Route component={App}>
				<IndexRoute component={Home}/>
				<Route path="about" component={About} />
				<Route>
					<Route path="dfetch" component={DFetch} onEnter={requireFetch(getDummy, { store, reduxState: 'dummy' })} />
				</Route>
				{/*<Route onEnter={requireLogin}> */}
				<Route onEnter={requireLogin(store)}>
					<Route path="contact" component={Contact} />
				</Route>
				{AuthViewRoute(store)}
			</Route>
			<Route path="flogin" component={FLogin} />
			<Route path="dlogin" component={DLogin} />
			{/*<Route path="login"></Route>*/}
		</Route>
	)
}

export const requireLogin = store => (nextState, replaceState, cb) => {
	const { auth } = store.getState()
	if (auth.tokenValid === true && auth.tokenExpired === true) {
		// rendering view but not fetching data
		console.log('token expired but still render view')
		cb()
	} else if (auth.isAuthenticated !== true) {
		// oops, not logged in, so can't be here!
		replaceState(null, 'dlogin', { to: nextState.location.pathname })
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
				replaceState(null, 'dlogin', { to: nextState.location.pathname })
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
// export const AuthRequired = function() {
// 	return WrappedRoute => <Route onEnter={requireLogin}>{WrappedRoute}</Route>
// }
