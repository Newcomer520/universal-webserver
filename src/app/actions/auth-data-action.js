import fetching from '../utils/fetch'

export const CONSTANTS = {
	AUTH_DATA_REQUESTING: Symbol('auth data requesting'),
	AUTH_DATA_REQUEST_SUCCESS: Symbol('auth data request success'),
	AUTH_DATA_REQUEST_FAILED: Symbol('auth data request failed')
}

export function fetchData() {
	const fetchResult = fetching('/api/adata', { method: 'get' })
	const { AUTH_DATA_REQUESTING, AUTH_DATA_REQUEST_SUCCESS, AUTH_DATA_REQUEST_FAILED } = CONSTANTS
	const types = [AUTH_DATA_REQUESTING, AUTH_DATA_REQUEST_SUCCESS, AUTH_DATA_REQUEST_FAILED]
	return {
		fetch: fetchResult,
		types
	}
}
