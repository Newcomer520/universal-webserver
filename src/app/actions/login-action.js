//import request from 'superagent'
import { CALL_API } from '../middlewares/api';
export const TYPES = {
	LOGIN_REQUESTING: Symbol('request login'),
	LOGIN_SUCCESS: Symbol('login success'),
	LOGIN_FAILED: Symbol('login failed')
}

export const login = (username, password) => {
	return {
		[CALL_API]: {
			method: 'post',
			path: '/api/login',
			sendingType: TYPES.LOGIN_REQUESTING,
			successType: TYPES.LOGIN_SUCCESS,
			failureType: TYPES.LOGIN_FAILED,
			set: ['Content-Type', 'application/json'],
			send: { "username": username, "password": password }
		}
	}
}
