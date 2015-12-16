import React from 'react'
import ReactDOM from 'react-dom/server'
import Html from '../components/Html/Html'
import App from '../components/App/App'
/**
 * Implement isomorphic middleware tool
 * 
 */
export default function(req, res, next) {
	if (__DEV__) {
		webpackIsomorphicTools.refresh()
	}
	res.send('<!doctype html>\n' +
		ReactDOM.renderToString(<Html component={<App />} assets={webpackIsomorphicTools.assets()} />))
		// ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>))
	// next()
}