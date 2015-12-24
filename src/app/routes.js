import React, { Component } from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import { replacePath, pushPath } from 'redux-simple-router'
import Home from 'components/Home'
import App from 'components/App'
import About from 'components/About'
import Contact from 'components/Contact'
import DLogin from 'components/DLogin'
import DFetch from 'components/DFetch'
import setDataFetched from 'actions/ddata-fetched'
import getDummy from 'actions/dfetch-action'
export default (store) => {
	const requireLogin = (nextState, replaceState, cb) => {
		const { auth } = store.getState()
		if (auth.isAuthenticated !== true) {
			// oops, not logged in, so can't be here!
			replaceState(null, 'flogin', { to: nextState.location.pathname })
		}
		cb()
  }

  const fetchData = (fetchMethod) => {
  	return (nextState, replaceState, cb) => {
  		if (store.getState().fetched === true) {
				return cb()
			}
			const result = fetchMethod()
			store.dispatch(result)
			const { types: [ REQUESTING, REQ_SUCCESS, REQ_FAILED ] } = result
			store.dispatch(setDataFetched(true))
			const unsubscribe = store.subscribe(() => {
				// @todo: how to know dummy here?
				if (store.getState().dummy.status === REQ_SUCCESS) {
					unsubscribe()
					cb()
				}
			})
  	}
  }

	return (
		<Route path="/">
			<Route component={App}>
				<IndexRoute component={Home}/>
				<Route path="about" component={About} />
				<Route>
					<Route path="dfetch" component={DFetch} onEnter={fetchData(getDummy)} />
				</Route>
				{/*<Route onEnter={requireLogin}> */}
				<Route onEnter={requireLogin}>
					<Route path="contact" component={Contact} />
				</Route>
			</Route>
			<Route path="flogin" component={FLogin} />
			{/*<Route path="login"></Route>*/}
		</Route>
	)
}
