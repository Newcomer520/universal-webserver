import { put, take, fork, select, call } from 'redux-saga/effects'
import TYPES from 'constants/action-types'
import { LOCATION_CHANGE } from 'react-router-redux'

export default function* appSaga() {
  yield fork(monitorLocationChanged)
  yield fork(updateTimeTask)
}

function* monitorLocationChanged() {
  let firstTimeVisitPage = true

  while (true) {
    yield take(LOCATION_CHANGE)
    if (firstTimeVisitPage) {
      firstTimeVisitPage = false
      continue
    }
    yield put({ type: TYPES.LOCATION_CHANGE })
  }
}

function* updateTimeTask() {
  while(true) {
    yield call(delay, 1000 * 60)
    yield put({ type: TYPES.APP_UPDATE_TIME, currentTime: Date.now().valueOf() })
  }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
