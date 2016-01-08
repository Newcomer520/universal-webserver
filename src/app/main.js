import React from 'react'
import ReactDOM from 'react-dom'
import getRoutes from './routes/index'
import createStore from './create-store'
import { Provider } from 'react-redux'
import Router from 'react-router'
import { syncReduxAndRouter } from 'redux-simple-router'

const createHistory = __UNIVERSAL__ === false ? require('history/lib/createHashHistory') : require('history/lib/createBrowserHistory')
const history = createHistory()
const store = createStore(window.__reduxState__) // __reduxState__ will be valid if universal rendering
syncReduxAndRouter(history, store)
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
