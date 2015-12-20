import React, { Component } from 'react'
import { Route, IndexRoute } from 'react-router'
import Home from './components/Home'
import App from './components/App'
import About from './components/About'
import Contact from './components/Contact'

export default (store) => {
	const requireLogin = (nextState, replaceState, cb) => {
		function checkAuth() {
			const { auth } = store.getState()
			if (!auth.get('isLogged')) {
				// oops, not logged in, so can't be here!
				replaceState(null, '/login')
			}
			cb()
		}
		cb()
		// checkAuth()
    // if (!isAuthLoaded(store.getState())) {
    //   store.dispatch(loadAuth()).then(checkAuth)
    // } else {
    //   checkAuth()
    // }
  }

	return (
		<Route path="/" component={App}>
			<IndexRoute component={Home}/>
			<Route path="about" component={About} />
			{/*<Route onEnter={requireLogin}>*/}
			<Route>
				<Route path="contact" component={Contact}>
				</Route>
			</Route>
			{/*<Route path="login"></Route>*/}
		</Route>
	)
}
