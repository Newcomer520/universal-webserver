import { TYPES } from 'actions/login-action'
import {
	GET_RECAPTCHA_RESPONSE_SUCCESS,
	GET_RECAPTCHA_RESPONSE_FAILED } from 'actions/recaptcha-action'
import { LOCATION_CHANGE } from 'react-router-redux'
import { SET_RECAPTCHA_ID } from 'actions/recaptcha-action'
import { TYPES as LOGOUT_TYPES } from 'actions/logout-action'

const { LOGIN_REQUESTING, LOGIN_SUCCESS, LOGIN_FAILED } = require('actions/login-action').TYPES

const initState = {
	status: null,
	recaptcha_id: null,
	recaptcha_response: null,
	is_btn_disable: false
}

export default function(state = initState, action) {
	switch (action.type) {
		case SET_RECAPTCHA_ID:
			return { ...state, recaptcha_id: action.recaptcha_id }
		case GET_RECAPTCHA_RESPONSE_SUCCESS:
			return { ...state, recaptcha_response: action.token }
		case GET_RECAPTCHA_RESPONSE_FAILED:
			return { ...state, recaptcha_response: null }
		case LOGIN_REQUESTING:
			return { ...state, status: action.type, is_btn_disable: true }
		case TYPES.LOGIN_SUCCESS:
			return { ...state, status: LOGIN_SUCCESS }
		case LOCATION_CHANGE:
			return { ...state, status: null }
	}

	return state
}
