import { TYPES as logout_actions } from 'actions/logout-action'
import CONSTANTS from 'constants'
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
      localStorage.setItem(CONSTANTS.KEY_REFRESH_TOKEN, action.result.refreshToken)
      next(action)
      const redirectUrl = store.getState().routing.locationBeforeTransitions.query.to || '/'
      browserHistory.push(redirectUrl)
      return
    case LOGOUT_SUCCESS:
      localStorage.removeItem(KEY_REFRESH_TOKEN)
      next(action)
      browserHistory.push('/')
      return
    case TYPES.REFRESH_TOKEN_DONE:
      localStorage.setItem(CONSTANTS.KEY_REFRESH_TOKEN, action.refreshToken)
      next(action)
      return
    case TYPES.AUTH_UNAUTHENTICATED:
      const originalUrl = store.getState().routing.locationBeforeTransitions.pathname || '/'
      const originalSearch = store.getState().routing.locationBeforeTransitions.search || ''
      const redirectTo = '/login?to=' + originalUrl + originalSearch
      browserHistory.push(redirectTo)
      // next(action)
      return
    default:
      next(action)
      return
  }
}
