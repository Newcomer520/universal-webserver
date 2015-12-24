import { UPDATE_PATH } from 'redux-simple-router'
import { FETCH_SET_TOKEN, REFRESH_TOKEN_DONE } from 'actions/fetch-action'
const { LOGIN_REQUESTING, LOGIN_SUCCESS, LOGIN_FAILED } = require('actions/dlogin-action').TYPES

export const initState = {
	tokenValid: false,
	tokenExpired: null,
	isAuthenticated: false,
	startAt: null,
	expiresIn: null,
	username: null,
	status: null,
	token: null, // access-token
	refreshToken: null
}
export default function(state = initState, action) {
	switch (action.type) {
		// do something if necessary
		case LOGIN_REQUESTING:
			return { ...state, status: action.type }
		case LOGIN_SUCCESS:
			localStorage.setItem('refresh-token', action.result.refreshToken)
			return {
				...state,
				tokenExpired: false,
				tokenValid: true,
				isAuthenticated: true,
				username: action.result.username,
				expiresIn: action.result.expiresIn,
				refreshToken: action.result.refreshToken,
				status: action.type
			}
		case LOGIN_FAILED:
			return { ...state, tokenExpired: null, tokenValid: false, isAuthenticated: false, status: action.type }
		case UPDATE_PATH:
			return { ...state, status: null }
		case FETCH_SET_TOKEN:
			return { ...state, token: action.token }
		case REFRESH_TOKEN_DONE:
			console.log('set new refresh token: ', action.newToken)
			localStorage.setItem('refresh-token', action.newToken)
			return { ...state, refreshToken: action.newToken }
	}
	return state
}
