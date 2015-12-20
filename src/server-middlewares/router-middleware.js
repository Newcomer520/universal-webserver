import React from 'react'
import ReactDOM from 'react-dom/server'
import Html from '../components/Html'
import { match, RoutingContext } from 'react-router'
import createHistory from 'history/lib/createMemoryHistory'
import getRoutes from '../routes'
import createStore from '../create-store'
import { Provider } from 'react-redux'

export default function(req, res, next) {
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
			// res.status(200).send(renderToString(<RouterContext {...renderProps} />))
		} else {
			res.status(404).send('Not found')
		}
	})
	// res.send('<!doctype html>\n' +
	// 	ReactDOM.renderToString(<Html component={<App />} assets={webpackIsomorphicTools.assets()} />))
		// ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>))
	// next()
}
