import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/lib/createBrowserHistory'
import getRoutes from './routes'
import createStore from './create-store'
import { Provider } from 'react-redux'
import Router from 'react-router'

const history = createHistory()
const store = createStore(history)
const routes = getRoutes(store)
const component = (
	<Provider store={store}>
		<Router history={history}>{routes}</Router>
	</Provider>
)

ReactDOM.render(
	component,
	document.getElementById('react-container')
)
