import { TYPES as login_actions } from 'actions/login-action'
import { TYPES as logout_actions } from 'actions/logout-action'
import { pushPath } from 'redux-simple-router'

const { LOGIN_SUCCESS } = login_actions
const { LOGOUT_SUCCESS } = logout_actions

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
