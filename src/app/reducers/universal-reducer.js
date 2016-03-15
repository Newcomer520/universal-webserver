import { TYPES } from 'actions/universal-action'

const { UNIVERSAL_LOAD } = TYPES

export const initState = {
	fetchAtBrowser: true
}
export default function(state = initState, action) {
	switch (action.type) {
		case UNIVERSAL_LOAD:
			return { ...state, fetchAtBrowser: action.fetchAtBrowser }
	}

	return state
}
