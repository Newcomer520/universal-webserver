import { SAGA_FETCH_ACTION } from '../utils/fetch'
import TYPES from 'constants/action-types'
import loginApi from 'app/apis/login'

export const login = (username, password) => {
	const fetch = loginApi(username, password)
	const status = [TYPES.LOGIN_REQUESTING, TYPES.LOGIN_SUCCESS, TYPES.LOGIN_FAILED]
	return { fetch, status, type: TYPES.SAGA_FETCH_ACTION }
}
