import { login as loginApi, SAGA_FETCH_ACTION } from '../utils/fetch'

export const TYPES = {
	LOGIN_REQUESTING: 'request_login',
	LOGIN_SUCCESS: 'login_success',
	LOGIN_FAILED: 'login_failed'
}

export const login = (username, password, gRecaptchaResponse) => {
	const fetch = loginApi(username, password, gRecaptchaResponse)
	const status = Object.keys(TYPES).map(k => TYPES[k])
	return { fetch, status, type: SAGA_FETCH_ACTION }
}
