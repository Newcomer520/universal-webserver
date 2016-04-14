import { fork, take, put, call, select } from 'redux-saga/effects'
import TYPES from 'constants/action-types'
import { apiActual, apiPredict } from 'app/apis/simulate'
import { fetchingTask } from 'sagas/fetch'
import { fetchActual } from 'actions/simulate-action'

const {
  SAGA_FETCH_ACTION,
  SIMULATE_PREDICT_FETCHING,
  SIMULATE_PREDICT_SUCCESS,
  SIMULATE_PREDICT_FAILED,
  SIMULATE_ACTUAL_FETCHING,
  SIMULATE_ACTUAL_SUCCESS,
  SIMULATE_ACTUAL_FAILED,
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
      yield put({ type: TYPES.SIMULATE_SET_OBSERVOR })
      // const simulate = yield select(state => state.simulate)
      // if (simulate.get('requestPredictStatus') !== TYPES.SIMULATE_PREDICT_SUCCESS) {
      //   yield call(getPredict)
      // } else {
      //   yield put({ type: TYPES.SIMULATE_SET_OBSERVOR })
      // }
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
  })
}


/**
 * get the actual result first, then the predict points.
 * @yield {[type]} [description]
 */
export function* actualAndPredictTask() {
  const requestActual = fetchActual()
  const actual = yield call(fetchingTask,  [], requestActual.fetch)
  let tasks = []
  let fetches = []
  if (actual && actual.rows && Array.isArray(actual.rows) && actual.rows.length > 0) {
    fetches = actual.rows
      .sort((a, b) => a.time.toNumber() > b.time.toNumber())
      .map((a, i) => {
        let { sbp, ...data } = a
        if (i == 0) {
          let time = data.time.toNumber()
          data.time = Math.floor(time / 1000 / 60 / 30) * 1000 * 30 * 60
        }
        return apiPredict(data)
        // return call(fetchingTask, [], apiPredict(data))
      })
    tasks = call(fetchingTask, [], ...fetches)
  }
  const predictIntervals = yield tasks
  let predict = {}
  if (predictIntervals.length > 0) {
    const sorted = predictIntervals
      .sort((a, b) => a.time.toNumber() > b.time.toNumber())
    predict = {
      time: sorted[0].time,
      rows: sorted.reduce((reduced, curr, currIdx, array) => {
        if (currIdx == array.length - 1) {
          curr.rows.forEach((r, i) => reduced.length < 360 && reduced.push(r))
        } else {
          const nextEntity = array[currIdx + 1]
          const currentTime = curr.time.toNumber()
          const nextTime = nextEntity.time.toNumber()
          const numbersOfEntity = parseInt((nextTime - currentTime) / 60 / 1000)
          curr.rows.forEach((r, i) => i < numbersOfEntity && reduced.push(r))
        }
        return reduced
      }, [])
    }
  }
  yield put({ type: SIMULATE_ACTUAL_SUCCESS, result: actual })
  yield put({ type: SIMULATE_PREDICT_SUCCESS, result: predict })
  const result = actual
  return result
}
