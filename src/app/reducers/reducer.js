import { routeReducer as routing } from 'redux-simple-router'
import { combineReducers } from 'redux'
import auth from 'reducers/auth-reducer'
import fetched from 'reducers/fetch-reducer'
import dummy from 'reducers/dummy-data-reducer'
import protectedData from 'reducers/auth-data-reducer'

const reducer = combineReducers({
	routing,
	auth,
	fetched,
	dummy,
	protectedData
})

export default reducer
