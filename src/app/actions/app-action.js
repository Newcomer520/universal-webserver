import TYPES from 'constants/action-types'

export function appBusy(isBusy = false) {
	return {
		type: TYPES.APP_LOADING,
		isBusy
	}
}
