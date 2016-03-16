import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import promiseMiddleware from './middlewares/promise-middleware'
import authMiddleware from './middlewares/auth-middleware'
import reducer from 'reducers/reducer'
import { canUseDOM, KEY_REFRESH_TOKEN } from './utils/fetch'
import merge from 'lodash.merge'
import { initState as authState } from 'reducers/auth-reducer'
import * as authSaga  from 'sagas/auth'
import { fetchSaga } from 'sagas/fetch'

const middlewares = [promiseMiddleware, authMiddleware]
export const sagaMiddleware = createSagaMiddleware(...[fetchSaga])
/**
 * function to create a redux store
 * history   {object}               from some createHistroy()
 * initState {object}								initial state passed to this store
 * @return   {object}               return a redux store
 */
export default function(initState) {
	if (canUseDOM && initState) {
		initState = merge({}, initState, { auth: { refreshToken: localStorage.getItem(KEY_REFRESH_TOKEN) } })
	}
	const finalCreateStore = compose(
		applyMiddleware(...middlewares, sagaMiddleware),
		__DEV__ && typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
	)(createStore)
	const store = finalCreateStore(reducer, initState)
	if (__DEV__ && module.hot) {
		// Enable Webpack hot module replacement for reducers
		module.hot.accept('./reducers', () => {
			const nextRootReducer = require('reducers/reducer')
			store.replaceReducer(nextRootReducer)
		})
	}
	return store
}
