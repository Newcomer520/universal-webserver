import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth from 'reducers/auth-reducer'
import dummy from 'reducers/dummy-data-reducer'
import protectedData from 'reducers/auth-data-reducer'
import fetchStatus from 'reducers/fetch-status-reducer'
import { reducer as formReducer } from 'redux-form'
import universal from 'reducers/universal-reducer'
import login from 'reducers/login-reducer'

const reducer = combineReducers({
	routing,
	auth,
	// dummy,
	fetchStatus,
	universal,
	login,
	form : formReducer //redux-form's reducer
})

export default reducer
