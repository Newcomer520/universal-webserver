import constants from 'flux-constants'

export default constants([
	// universal
	'UNIVERSAL_LOAD',
	// application level constants
	'APP_LOADING',

	// fetch related
	'SAGA_FETCH_ACTION',
	'SAGA_PRELOAD_ACTION',
	'REFRESH_TOKEN_DONE',

	//
	// simulate page
	'SIMULATE_SELECT_CATEGORY',
	'SIMULATE_SELECT_TYPE',
	'SIMULATE_ACTUAL_PREDICT_FETCHING',
	'SIMULATE_ACTUAL_PREDICT_SUCCESS',
	'SIMULATE_ACTUAL_PREDICT_FAILED',
	'SIMULATE_TYPE_SBP',
	'SIMULATE_TYPE_TIME_SERIES'

])
