import React from 'react'
import ReactDOM from 'react-dom/server'
import Html from '../components/Html'
import { match, RoutingContext } from 'react-router'
import createHistory from 'history/lib/createMemoryHistory'
import getRoutes from '../routes'
import createStore from '../create-store'
import { Provider } from 'react-redux'



export default function(req, res, next) {
	global.config.universal === true? universalRender(req, res, next): nonUniversalRender(req, res, next)
}

function universalRender(req, res, next) {
	const history = createHistory()
	const store = createStore(history)
	const routes = getRoutes(store)
	match({ routes, location: req.originalUrl }, function(error, redirectLocation, renderProps) {
		if (error) {
			res.status(500).send(error.message)
		} else if (redirectLocation) {
			res.redirect(302, redirectLocation.pathname + redirectLocation.search)
		} else if (renderProps) {
			const component = (
				<Provider store={store}>
					<RoutingContext {...renderProps}/>
				</Provider>
			)
			res.send('<!doctype html>' +
				ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />)
			)
		} else {
			res.status(404).send('Not found')
		}
	})
}

function nonUniversalRender(req, res, next) {
	const validUrls = /^\/$|^\/index\.html$/i
	if (!validUrls.test(req.url)) {
		res.status(404).send('Page not found')
	} else {
		res.send('<!doctype html>' +
			ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} />)
		)
	}
}
