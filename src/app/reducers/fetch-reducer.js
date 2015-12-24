import { UPDATE_PATH } from 'redux-simple-router'
import { DATA_FETCHED } from 'actions/fetch-action'

const initState = {
	isFetched: false,
	currentPromise: null
}

export default function(state = false, { type, fetched, promise }) {
	switch (type) {
		case UPDATE_PATH:
			return false
		case DATA_FETCHED:
			return fetched
	}
	return state
}
