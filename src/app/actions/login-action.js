import { login as loginApi } from '../utils/fetch'

export const TYPES = {
	LOGIN_REQUESTING: 'request_login',
	LOGIN_SUCCESS: 'login_success',
	LOGIN_FAILED: 'login_failed'
}

export const login = (username, password, gRecaptchaResponse) => {
	const fetch = loginApi(username, password, gRecaptchaResponse)
	const types = Object.keys(TYPES).map(k => TYPES[k])
	return { fetch, types }
}
