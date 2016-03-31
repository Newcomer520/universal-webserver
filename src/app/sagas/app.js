import { put, take, fork } from 'redux-saga/effects'
import TYPES from 'constants/action-types'
import { LOCATION_CHANGE } from 'react-router-redux'

export default function* appSaga() {
  yield fork(monitorLocationChanged)
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
