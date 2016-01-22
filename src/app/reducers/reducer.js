import { routeReducer as routing } from 'redux-simple-router'
import { combineReducers } from 'redux'
import auth from 'reducers/auth-reducer'
import fetched from 'reducers/fetch-reducer'
import dummy from 'reducers/dummy-data-reducer'
import protectedData from 'reducers/auth-data-reducer'
import fetchStatus from 'reducers/fetch-status-reducer'
import { reducer as formReducer } from 'redux-form'

const reducer = combineReducers({
	routing,
	auth,
	fetched,
	dummy,
	fetchStatus,
	protectedData,
	form : formReducer //redux-form's reducer
})

export default reducer
