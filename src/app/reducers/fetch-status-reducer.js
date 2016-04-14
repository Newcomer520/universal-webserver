import { TYPES as FETCH_STATUS_TYPES} from 'actions/fetch-status-action'
const { FETCH_STATUS_REQUESTING, FETCH_STATUS_SUCCESS, FETCH_STATUS_FAILED } = FETCH_STATUS_TYPES

const initState = {
	status: null,
	data: []
}

export default function(state = initState, { type, result }) {
	switch (type) {
		case FETCH_STATUS_REQUESTING:
			return { ...state, status: FETCH_STATUS_REQUESTING, data: [] }
		case FETCH_STATUS_SUCCESS:
			return { data: result, status: FETCH_STATUS_SUCCESS }
		case FETCH_STATUS_FAILED:
			return { ...state, status: FETCH_STATUS_FAILED }
	}
	return state
}
