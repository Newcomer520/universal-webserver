import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux'
import auth from 'reducers/auth-reducer'
import { reducer as formReducer } from 'redux-form'
import universal from 'reducers/universal-reducer'
import login from 'reducers/login-reducer'
import simulate from 'reducers/simulate-reducer'
import app from 'reducers/app-reducer'

const reducer = combineReducers({
	app,
	routing,
	auth,
	universal,
	login,
	simulate,
	form : formReducer //redux-form's reducer
})

export default reducer
