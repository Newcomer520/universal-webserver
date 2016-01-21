import React from 'react'
import ReactDOM from 'react-dom'
import getRoutes from './routes/index'
import createStore from './create-store'
import { Provider } from 'react-redux'
import Router from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { syncReduxAndRouter } from 'redux-simple-router'

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

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
