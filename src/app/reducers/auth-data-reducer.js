const { AUTH_DATA_REQUESTING, AUTH_DATA_REQUEST_SUCCESS, AUTH_DATA_REQUEST_FAILED } = require('actions/auth-data-action').CONSTANTS

const initState = {
	data: [],
	status: null
}

export default function(state = initState, { type, result, error, ...rest }) {
	switch(type) {
		case AUTH_DATA_REQUESTING:
			return { ...state, status: type }
		case AUTH_DATA_REQUEST_SUCCESS:
			return { status: type, data: result }
		case AUTH_DATA_REQUEST_FAILED:
			return { ...state, status: type }
	}
	return state
}
