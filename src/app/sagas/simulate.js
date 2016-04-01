import { fork, take, put, call, select } from 'redux-saga/effects'
import TYPES from 'constants/action-types'
import { apiActual, apiPredict } from 'app/apis/simulate'

const {
  SAGA_FETCH_ACTION,
  SIMULATE_PREDICT_FETCHING,
  SIMULATE_PREDICT_SUCCESS,
  SIMULATE_PREDICT_FAILED,
  SIMULATE_ACTUAL_FETCHING, SIMULATE_ACTUAL_SUCCESS, SIMULATE_ACTUAL_FAILED
} = TYPES

export function* simulateSaga() {
  yield [
    fork(requestPredict)
  ]
}

/**
 * user 選取新的type時
 * @yield {[type]} [description]
 */
function* requestPredict() {
  while (true) {
    try {
      const { selectedType: type } = yield take(TYPES.SIMULATE_SELECT_TYPE)
      const simulate = yield select(state => state.simulate)
      if (simulate.get('requestPredictStatus') !== TYPES.SIMULATE_PREDICT_SUCCESS) {
        yield call(getPredict)
      } else {
        yield put({ type: TYPES.SIMULATE_SET_OBSERVOR })
      }
    } catch (ex) {
      console.error(ex)
      yield put({ type: TYPES.SIMULATE_PREDICT_FAILED })
    }
  }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function* getPredict() {
  const actualFirstRecord = yield select((state) => state.simulate.get('actualFirstRecord'))
  if (!actualFirstRecord) {
    console.warn('actual data does not exist.')
    return
  }
  const { sbp, ...data } = actualFirstRecord.toObject()
  yield put({
    type: SAGA_FETCH_ACTION,
    fetch: apiPredict(data),
    status: [SIMULATE_PREDICT_FETCHING, SIMULATE_PREDICT_SUCCESS, SIMULATE_PREDICT_FAILED]
    // status: [SIMULATE_ACTUAL_FETCHING, SIMULATE_ACTUAL_SUCCESS, SIMULATE_ACTUAL_FAILED]
  })
}
