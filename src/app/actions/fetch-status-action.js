import { fetchStatus as fetchStatusApi } from '../utils/fetch'

export const TYPES = {
	FETCH_STATUS_REQUESTING: `Symbol('request fetch status')`,
	FETCH_STATUS_SUCCESS: `Symbol('fetch status success')`,
	FETCH_STATUS_FAILED: `Symbol('fetch status failed')`
}

export const fetchStatus = () => {
	const fetch = fetchStatusApi()
	const types = Object.keys(TYPES).map(k => TYPES[k])
	return { fetch, types }
}
