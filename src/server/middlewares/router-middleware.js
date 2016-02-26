import React from 'react'
import ReactDOM from 'react-dom/server'
import Html from 'app/components/Html'
import { match, RoutingContext } from 'react-router'
import createHistory from 'history/lib/createMemoryHistory'
import getRoutes from 'app/routes'
import createStore from 'app/create-store'
import { Provider } from 'react-redux'
import authHelper, { COOKIE_AUTH_TOKEN } from '../helpers/server-auth-helper'
import { replacePath, pushPath } from 'redux-simple-router'
import { setFetched, clearToken } from 'actions/fetch-action'
import { Router } from 'express'
import authenticator from './authenticator'
import fs from 'fs'

const assets = JSON.parse(fs.readFileSync('./build/assets.json', 'utf-8'))

const router = new Router()
router.use(authenticator)
router.get('*', routesHandler)
export default router

function routesHandler(req, res) {
	const userInfo = req.userInfo
	const initState = {
		auth: {
			isAuthenticated: userInfo.isAuthenticated,
			startAt: userInfo.startAt,
			expiresIn: userInfo.expiresIn,
			username: userInfo.username,
			tokenValid: userInfo.tokenValid,
			tokenExpired: userInfo.tokenExpired,
			token: req.token
		}
	}
	const store = createStore(initState)
	global.config.universal === true? universalRender(store).call(this, req, res): nonUniversalRender(store).call(this, req, res)
}

function universalRender(store) {
	return (req, res) => {
		const routes = getRoutes(store, req)
		match({ routes, location: req.originalUrl }, function(error, redirectLocation, renderProps) {
			if (error) {
				res.status(500).send(error.message)
			} else if (redirectLocation) {
				res.redirect(302, redirectLocation.pathname + redirectLocation.search)
			} else if (renderProps) {
				// material ui use js inline style, need to mock a navigator
				global.navigator = { userAgent: req.headers['user-agent'] }
				// prevent the token from going to front-end
				store.dispatch(clearToken())
				const component = (
					<Provider store={store}>
						<RoutingContext {...renderProps}/>
					</Provider>
				)
				res.send('<!doctype html>' +
					ReactDOM.renderToStaticMarkup(<Html assets={assets} component={component} store={store} />)
				)
			} else {
				res.status(404).send('Not found')
			}
		})
	}
}

function nonUniversalRender(store) {
	return (req, res) => {
		const validUrls = /^\/$|^\/index\.html$/i
		if (!validUrls.test(req.url)) {
			res.status(404).send('Page not found')
		} else {
			res.send('<!doctype html>' +
				ReactDOM.renderToString(<Html assets={assets} store={store} />)
			)
		}
	}
}
