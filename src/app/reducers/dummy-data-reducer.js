const { DUMMY_REQUESTING, DUMMY_SUCCESS, DUMMY_FAILED } = require('actions/dummy-action').TYPES
const initState = {
	status: null,
	data: []
}

export default function(state = initState, { type, result }) {
	switch (type) {
		case DUMMY_REQUESTING:
			return { ...state, status: DUMMY_REQUESTING, data: [] }
		case DUMMY_SUCCESS:
			return { data: result, status: DUMMY_SUCCESS }
		case DUMMY_FAILED:
			return { ...state, status: DUMMY_FAILED }
	}
	return state
}
