import appSaga from './app'
import { fetchSaga } from './fetch'
import { simulateSaga } from './simulate'

export default [appSaga, fetchSaga, simulateSaga]
