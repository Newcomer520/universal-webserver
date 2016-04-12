import { TYPES as logout_actions } from 'actions/logout-action'
import { REFRESH_TOKEN_DONE, KEY_REFRESH_TOKEN } from 'app/utils/fetch'
import { browserHistory } from 'react-router'
import TYPES from 'constants/action-types'

const { LOGIN_SUCCESS } = TYPES
const { LOGOUT_SUCCESS } = logout_actions

// auth-middleware will trigger only when login success
// then chage to the index page and store the refresh token
export default store => next => action => {
	if (!action) {
		return
	}
	switch (action.type) {
		case LOGIN_SUCCESS:
			localStorage.setItem(KEY_REFRESH_TOKEN, action.result.refreshToken)
			next(action)
			const redirectUrl = store.getState().routing.locationBeforeTransitions.query.to || '/'
			browserHistory.push(redirectUrl)
			// next(pushPath('/'))
			return
		case LOGOUT_SUCCESS:
			localStorage.removeItem(KEY_REFRESH_TOKEN)
			next(action)
			browserHistory.push('/')
			return
		case REFRESH_TOKEN_DONE:
			localStorage.setItem(KEY_REFRESH_TOKEN, action.newToken)
			next(action)
			return
		default:
			next(action)
			return
	}
}
