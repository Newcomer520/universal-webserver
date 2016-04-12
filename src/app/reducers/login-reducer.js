import { LOCATION_CHANGE } from 'react-router-redux'
import { SET_RECAPTCHA_ID } from 'actions/recaptcha-action'
import TYPES from 'constants/action-types'

const { LOGIN_REQUESTING, LOGIN_SUCCESS, LOGIN_FAILED } = TYPES

const initState = {
	status: null,
	is_btn_disable: false
}

export default function(state = initState, action) {
	switch (action.type) {
		case LOGIN_REQUESTING:
			return { ...state, status: action.type, is_btn_disable: true }
		case TYPES.LOGIN_SUCCESS:
			return { ...state, status: LOGIN_SUCCESS }
		case LOCATION_CHANGE:
			return { ...state, status: null }
	}

	return state
}
