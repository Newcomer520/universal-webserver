import React from 'react'
import ReactDOM from 'react-dom/server'
import Html from 'app/components/Html'
import { match, RouterContext } from 'react-router'
import createHistory from 'history/lib/createMemoryHistory'
import getRoutes from 'app/routes'
import createStore from 'app/create-store'
import { Provider } from 'react-redux'
import authHelper, { COOKIE_AUTH_TOKEN } from '../helpers/server-auth-helper'
import { replacePath, pushPath } from 'redux-simple-router'
import { setFetched, clearToken } from 'actions/fetch-action'
import koa from 'koa'
import authenticator from './authenticator'
import fs from 'fs'

const assets = JSON.parse(fs.readFileSync('./build/assets.json', 'utf-8'))

const frontend = koa()
frontend.use(authenticator)
frontend.use(initStore)
global.config.universal === true ? frontend.use(universalRender): frontend.use(nonUniversalRender)

function *initStore(next) {
	console.log('this.originalUrl0', this.originalUrl)
	const { userInfo } = this.state
	const initState = {
		auth: {
			isAuthenticated: userInfo.isAuthenticated,
			startAt: userInfo.startAt,
			expiresIn: userInfo.expiresIn,
			username: userInfo.username,
			tokenValid: userInfo.tokenValid,
			tokenExpired: userInfo.tokenExpired,
			token: this.state.token
		}
	}
	this.state.store = createStore(initState)
	yield next
}
function *universalRender(next) {
	const ctx = this
	const { state: { store } } = this
	const routes = getRoutes(store)

	match({ routes, location: this.originalUrl }, function(error, redirectLocation, renderProps) {
		if (error) {
			ctx.throw(error.message, 500)
		} else if (redirectLocation) {
			ctx.redirect(redirectLocation.pathname + redirectLocation.search)
		} else if (renderProps) {
			// material ui use js inline style, need to mock a navigator
			global.navigator = { userAgent: ctx.request.get('user-agent') }
			// prevent the token from going to front-end
			store.dispatch(clearToken())
			const component = (
				<Provider store={store}>
					<RouterContext {...renderProps}/>
				</Provider>
			)
			ctx.body = '<!doctype html>' +
				ReactDOM.renderToStaticMarkup(<Html assets={assets} component={component} store={store} />)
		} else {
			ctx.throw('Not found', 404)
		}
	})
}

function *nonUniversalRender(next) {
	const validUrls = /^\/$|^\/index\.html$/i
	if (!validUrls.test(this.url)) {
		this.throw('Page not found', 404)
	} else {
		this.body = '<!doctype html>' +
			ReactDOM.renderToString(<Html assets={assets} store={this.state.store} />)
	}
}

export default frontend
