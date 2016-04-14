import { TYPES as LOGOUT_TYPES } from 'actions/logout-action'
import TYPES from 'constants/action-types'
import { browserHistory } from 'react-router'
import { fromJS } from 'immutable'

const { REFRESH_TOKEN_DONE, LOGIN_SUCCESS, LOGIN_FAILED } = TYPES
const { LOGOUT_REQUESTING, LOGOUT_SUCCESS, LOGOUT_FAILED } = LOGOUT_TYPES
export const initState = fromJS({
  tokenValid: false,
  tokenExpired: null,
  isAuthenticated: false,
  expiresIn: null,
  username: null,
  status: null,
  token: null, // access-token
  refreshToken: null,
})

export default function(state = initState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return state.merge({
        tokenExpired: false,
        tokenValid: true,
        isAuthenticated: true,
        username: action.result.username,
        expiresIn: action.result.expiresIn,
        refreshToken: action.result.refreshToken,
      })
    case LOGIN_FAILED:
      return state.merge({
        tokenExpired: null,
        tokenValid: false,
        isAuthenticated: false,
      })
    case TYPES.REFRESH_TOKEN_DONE:
      const payload = JSON.parse(atob(action.accessToken.split('.')[1]))
      return state.merge({
        refreshToken: action.refreshToken,
        expiresIn: payload.exp * 1000,
        scope: payload.scope,
      })
    case LOGOUT_SUCCESS:
      // same with LOGIN_FAILED
      return state.merge({
        tokenExpired: null,
        tokenValid: false,
        isAuthenticated: false,
        status: action.type,
      })
    case TYPES.UNIVERSAL_SET_TOKEN:
      return state.set('token', action.token)
  }
  return state
}
