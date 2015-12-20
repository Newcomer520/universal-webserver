import { createStore } from 'redux'
import { syncReduxAndRouter } from 'redux-simple-router'
import reducer from './reducers'
/**
 * function to create a redux store
 * @return {object}               return a redux store
 */
export default function(history) {
	const store = createStore(reducer)
	syncReduxAndRouter(history, store)
	return store
}
