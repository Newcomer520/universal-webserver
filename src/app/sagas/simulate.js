import { fork, take, put, call, select } from 'redux-saga/effects'
import TYPES from 'constants/action-types'
import { apiActual, apiPredict } from 'app/apis/simulate'

const { 
	SAGA_FETCH_ACTION, 
	SIMULATE_ACTUAL_PREDICT_FETCHING,
	SIMULATE_ACTUAL_PREDICT_SUCCESS,
	SIMULATE_ACTUAL_PREDICT_FAILED 
} = TYPES

export function* simulateSaga() {
	yield [
		fork(requestActualAndPredict)
	]
}

/**
 * user 選取新的type時
 * @yield {[type]} [description]
 */
function* requestActualAndPredict() {
	while (true) {
		try {
			const { selectedType: type } = yield take(TYPES.SIMULATE_SELECT_TYPE)
			const simulate = yield select(state => state.simulate)

			const { actual, predict } = yield call(actualAndPredict, type)
			// if (simulate.get('requestStatus') !== TYPES.SIMULATE_ACTUAL_PREDICT_SUCCESS) {
			// 	yield put({ type: TYPES.SIMULATE_ACTUAL_PREDICT_FETCHING })
			// 	const { actual, predict } = yield call(actualAndPredict, type)
			// 	yield put({ type: TYPES.SIMULATE_ACTUAL_PREDICT_SUCCESS, actual, predict })
			// } else {
			// 	yield put({ type: TYPES.SIMULATE_ACTUAL_PREDICT_SUCCESS })
			// }
		} catch (ex) {
			console.error(ex)
			yield put({ type: TYPES.SIMULATE_ACTUAL_PREDICT_FAILED })
		}
	}
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function* actualAndPredict() {
	yield put({ 
		type: SAGA_FETCH_ACTION, 
		fetch: [apiActual(), apiPredict()],
		// fetch: apiActual(), 
		status: [SIMULATE_ACTUAL_PREDICT_FETCHING, SIMULATE_ACTUAL_PREDICT_SUCCESS, SIMULATE_ACTUAL_PREDICT_FAILED] 
	})

	return {
		actual: [ 1, 2, 3 ],
		predict: [4, 5, 6]
	}
}

function* predictApi() {

}
