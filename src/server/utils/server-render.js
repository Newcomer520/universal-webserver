import React from 'react'
import { RouterContext } from 'react-router'
import { fetchingTask } from 'sagas/fetch'
import { sagaMiddleware } from 'app/create-store'
import { call, put, take, fork } from 'redux-saga/effects'
import { Provider } from 'react-redux'
import { findPreloaderTasks } from 'app/utils/universal'

export default (authState, renderProps, options) => new Promise((resolve, reject) => {
	const preloaderTasks = findPreloaderTasks(authState, renderProps.components, renderProps.params, options)
	sagaMiddleware.run(serverStartupSaga(preloaderTasks)).done
		.then((isFetch) => resolve(isFetch))
})

/**
 * preload at server side
 * @yield {[type]} [description]
 * @return isFetch  are data fetched successfully
 */
const serverStartupSaga = (preloaderTasks) => function* () {
	if (preloaderTasks.length == 0) { // no preload tasks needed
		return true
	}
	console.log('serverFecthing start')
	const result = yield preloaderTasks
	const isFetched = result.reduce((r, isNoFetch) => !!isNoFetch || r, false)
	return isFetched
}
