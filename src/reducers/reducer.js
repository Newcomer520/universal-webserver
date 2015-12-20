import { routeReducer } from 'redux-simple-router'
import { combineReducers } from 'redux'

const reducer = combineReducers({
	routing: routeReducer
})

export default reducer
