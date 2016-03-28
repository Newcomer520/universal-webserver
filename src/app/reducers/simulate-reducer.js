import { fromJS, Map } from 'immutable'
import TYPES from 'constants/action-types'

const initState = fromJS({
	categories: { 'LOW_BLOOD': '低血壓' },
	types: null, //SBP1
	selectedCategory: null,
	selectedType: null,
	observor: null,
	obTime: null,
	// data
	actual: {},
	predict: null,
	simulation: null,
	// status
	requestActualStatus: null, // user 欲查詢所選的category & type
	requestPredictStatus: null,
	simulateStatus: null // user 欲進行模擬資料
})

export default function (state = initState, action) {
	switch (action.type) {
		case TYPES.SIMULATE_SELECT_CATEGORY:
			if (action.selectedCategory && state.get('categories').has(action.selectedCategory)) {
				const types = {
					[TYPES.SIMULATE_TYPE_SBP]: 'SBP',
					[TYPES.SIMULATE_TYPE_TIME_SERIES]: 'Time Series'
				}
				return state.merge({ selectedCategory: action.selectedCategory, types })
			} else if (state.get(selectedCategory)) { // reset
				return state.merge({ selectedCategory: null, selectedType: null, types: null })
			}
			break
		case TYPES.SIMULATE_SELECT_TYPE:
			if (action.selectedType && state.get('types').has(action.selectedType)) {
				return state.merge({ selectedType: action.selectedType })
			}
			break
		case TYPES.SIMULATE_ACTUAL_SUCCESS:
			const { result } = action
			let actual

			if (result && result.rows) {
				actual = result.rows.reduce((prev, currRow) => {
					// time is type of long, need to convert it to a number
					prev[currRow.time.toNumber()] = { ...currRow, time: currRow.time.toNumber() }
					return prev
				}, {})
			}

			return state.merge({
				requestStatus: action.type,
				actual,
				observor: state.get('selectedType')
			})
	}

	return state
}

