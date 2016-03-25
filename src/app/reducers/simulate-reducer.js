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
	actual: null,
	predict: null,
	simulation: null,
	// status
	requestStatus: null, // user 欲查詢所選的category & type
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
		case TYPES.SIMULATE_ACTUAL_PREDICT_SUCCESS:
			const { actual, predict } = action
			return state.merge({
				requestStatus: action.type,
				actual,
				predict,
				observor: state.get('selectedType')
			})
	}

	return state
}

