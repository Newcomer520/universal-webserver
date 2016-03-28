import { TYPES as LOGOUT_TYPES } from 'actions/logout-action'
import TYPES from 'constants/action-types'

const { REFRESH_TOKEN_DONE } = TYPES
const { LOGIN_REQUESTING, LOGIN_SUCCESS, LOGIN_FAILED } = require('actions/login-action').TYPES
const { LOGOUT_REQUESTING, LOGOUT_SUCCESS, LOGOUT_FAILED } = LOGOUT_TYPES
export const initState = {
	tokenValid: false,
	tokenExpired: null,
	isAuthenticated: false,
	startAt: null,
	expiresIn: null,
	username: null,
	status: null,
	token: null, // access-token
	refreshToken: null,
}
export default function(state = initState, action) {
	switch (action.type) {
		case LOGIN_SUCCESS:
			return {
				...state,
				tokenExpired: false,
				tokenValid: true,
				isAuthenticated: true,
				username: action.result.username,
				expiresIn: action.result.expiresIn,
				refreshToken: action.result.refreshToken,
				is_btn_disable: false
			}
		case LOGIN_FAILED:
			return {
				...state,
				tokenExpired: null,
				tokenValid: false,
				isAuthenticated: false,
				is_btn_disable: false
			}
		case REFRESH_TOKEN_DONE:
			return { ...state, refreshToken: action.newToken }
		case LOGOUT_SUCCESS:
			// same with LOGIN_FAILED
			return { ...state, tokenExpired: null, tokenValid: false, isAuthenticated: false, status: action.type }
	}
	return state
}
