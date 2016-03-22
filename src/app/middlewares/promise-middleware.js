export default function () {
	return next => action => {
		if (!action) {
			return
		}
		const { promise, types, ...rest }	= action
		if (!promise || !types) {
			return next(action)
		}
		const [REQUESTING, SUCCESS, FAILURE] = types
		next({ ...rest, type: REQUESTING })
		return promise.then(
			result => next({ ...rest, result, type: SUCCESS }),
			error => next({ ...rest, error, type: FAILURE })
		)
	}
}
