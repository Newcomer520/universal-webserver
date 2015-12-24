// front-middlewares/api.js
import superAgent from 'superagent'

export const CALL_API = Symbol('CALL_API')

// store
// next = store.dispatch
// action = next
export const login_middleware = store => next => action => {
	if (!action[CALL_API]) {
		return next(action)
	}

	// request action object
	let request = action[CALL_API]
	let { set, send, method, path, query, failureType, successType, sendingType } = request;
	//let { dispatch } = store;

	next({ type: sendingType });
	superAgent[method](path)
		.set(set[0], set[1])
		.send(send)
		.end((err, res) => {
			console.log('got response')
			if (err) {
				console.log(err)
				// dispatch({
				// 	type: failureType,
				// 	response: err
				// })

			}else {
				console.log(res.body)
				localStorage.setItem('refreshToken', res.body.refreshToken)
				// dispatch({
				// 	type: successType,
				// 	response: res.body
				// })
			}
		});
};

