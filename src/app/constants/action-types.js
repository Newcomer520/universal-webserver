import constants from 'flux-constants'

export default constants([
  // universal
  'UNIVERSAL_LOAD',
  // application level constants
  'APP_LOADING',
  'LOCATION_CHANGE', // the LOCATION_CHANGED from react-router-redux is wired, will fire at first rendering time

  // fetch related
  'SAGA_FETCH_ACTION',
  'SAGA_PRELOAD_ACTION',
  'REFRESH_TOKEN_DONE',

  //
  // simulate page
  'SIMULATE_SELECT_CATEGORY',
  'SIMULATE_SELECT_TYPE',
  'SIMULATE_ACTUAL_FETCHING',
  'SIMULATE_ACTUAL_SUCCESS',
  'SIMULATE_ACTUAL_FAILED',
  'SIMULATE_PREDICT_FETCHING',
  'SIMULATE_PREDICT_SUCCESS',
  'SIMULATE_PREDICT_FAILED',
  'SIMULATE_SIMULATE_FETCHING',
  'SIMULATE_SIMULATE_SUCCESS',
  'SIMULATE_SIMULATE_FAILED',
  'SIMULATE_TYPE_SBP',
  'SIMULATE_TYPE_TIME_SERIES',
  'SIMULATE_SET_OB_TIME'
])
