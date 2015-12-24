export const DATA_FETCHED = Symbol('data fetched')
export const FETCH_SET_TOKEN = Symbol('fetch of setting token')
export const REFRESH_TOKEN_DONE = Symbol('refresh token done')

export function setFetched(isFetched) {
	return {
		type: DATA_FETCHED,
		fetched: isFetched
	}
}

export function setToken(token) {
	return {
		type: FETCH_SET_TOKEN,
		token: token
	}
}

export function clearToken() {
	return {
		type: FETCH_SET_TOKEN,
		token: null
	}
}
