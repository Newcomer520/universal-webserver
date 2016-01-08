import { login as loginApi } from '../utils/fetch'

export const TYPES = {
	LOGIN_REQUESTING: Symbol('request login'),
	LOGIN_SUCCESS: Symbol('login success'),
	LOGIN_FAILED: Symbol('login failed')
}

export const login = (username, password, gRecaptchaResponse) => {
	const fetch = loginApi(username, password, gRecaptchaResponse)
	const types = Object.keys(TYPES).map(k => TYPES[k])
	return { fetch, types }
}
