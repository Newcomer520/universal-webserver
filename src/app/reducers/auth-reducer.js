import { pushPath, UPDATE_PATH } from 'redux-simple-router'
import { TYPES as LOGOUT_TYPES } from 'actions/logout-action'
import { SET_RECAPTCHA_ID } from 'actions/recaptcha-action'
import { GET_RECAPTCHA_RESPONSE_SUCCESS } from 'actions/recaptcha-action'
import { GET_RECAPTCHA_RESPONSE_FAILED } from 'actions/recaptcha-action'
import { FETCH_SET_TOKEN, REFRESH_TOKEN_DONE } from 'actions/fetch-action'
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
	recaptcha_id: null,
	recaptcha_response: null,
	is_btn_disable: false
}
export default function(state = initState, action) {
	switch (action.type) {
		// do something if necessary
		case SET_RECAPTCHA_ID:
			return { ...state, recaptcha_id: action.recaptcha_id }
		case GET_RECAPTCHA_RESPONSE_SUCCESS:
			return { ...state, recaptcha_response: action.token }
		case GET_RECAPTCHA_RESPONSE_FAILED:
			return { ...state, recaptcha_response: null }
		case LOGIN_REQUESTING:
			return { ...state, status: action.type, is_btn_disable: true }
		case LOGIN_SUCCESS:
			return {
				...state,
				tokenExpired: false,
				tokenValid: true,
				isAuthenticated: true,
				username: action.result.username,
				expiresIn: action.result.expiresIn,
				refreshToken: action.result.refreshToken,
				status: action.type,
				is_btn_disable: false
			}
		case LOGIN_FAILED:
			return {
				...state,
				tokenExpired: null,
				tokenValid: false,
				isAuthenticated: false,
				status: action.type,
				is_btn_disable: false
			}
		case UPDATE_PATH:
			return { ...state, status: null }
		case FETCH_SET_TOKEN:
			return { ...state, token: action.token }
		case REFRESH_TOKEN_DONE:
			console.log('set new refresh token: ', action.newToken)
			localStorage.setItem('refresh-token', action.newToken)
			return { ...state, refreshToken: action.newToken }
		case LOGOUT_REQUESTING:
			return {...state}
		case LOGOUT_SUCCESS:
			// same with LOGIN_FAILED
			return { ...state, tokenExpired: null, tokenValid: false, isAuthenticated: false, status: action.type }
	}
	return state
}
