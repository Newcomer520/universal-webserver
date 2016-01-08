import { TYPES as loginActions } from 'actions/login-action'
import { TYPES as logoutActions } from 'actions/logout-action'
import { pushPath } from 'redux-simple-router'

const { LOGIN_SUCCESS } = loginActions
const { LOGOUT_SUCCESS } = logoutActions

// auth-middleware will trigger only when login success
// then chage to the index page and store the refresh token
export default store => next => action => {
	if (!action) {
		return
	}
	switch (action.type) {
	case LOGIN_SUCCESS:
		localStorage.setItem('refresh-token', action.result.refreshToken)
		next(action)
		next(pushPath('/'))
		return
	case LOGOUT_SUCCESS:
		localStorage.removeItem('refresh-token')
		next(action)
		next(pushPath('/login'))
		return
	default:
		next(action)
		return
	}
}
