import { logout as logoutApi } from '../utils/fetch'

export const TYPES = {
	LOGOUT_REQUESTING: Symbol('request logout'),
	LOGOUT_SUCCESS: Symbol('logout success'),
	LOGOUT_FAILED: Symbol('logout failed')
}

export const logout = () => {
	const fetch = logoutApi()
	const types = Object.keys(TYPES).map(k => TYPES[k])
	return { fetch, types }
}
