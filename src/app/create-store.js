import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import fetchMiddleware from './middlewares/fetch-middleware'
import promiseMiddleware from './middlewares/promise-middleware'
import authMiddleware from './middlewares/auth-middleware'
import reducer from 'reducers/reducer'
import { canUseDOM } from './utils/fetch'
import merge from 'lodash.merge'
import { initState as authState } from 'reducers/auth-reducer'
import { addFiles as addFilesSaga, uploadFiles as uploadFilesSaga } from 'sagas/file-upload'

const sagaMiddlewares = createSagaMiddleware(addFilesSaga, uploadFilesSaga)
const middlewares = [fetchMiddleware, promiseMiddleware, authMiddleware, sagaMiddlewares]

/**
 * function to create a redux store
 * history   {object}               from some createHistroy()
 * initState {object}								initial state passed to this store
 * @return   {object}               return a redux store
 */
export default function(initState) {
	if (canUseDOM && initState) {
		initState = merge({}, initState, { auth: { refreshToken: localStorage.getItem('refresh-token') } })
	}
	const finalCreateStore = compose(
		applyMiddleware(...middlewares),
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
