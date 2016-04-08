import { fromJS, Map } from 'immutable'
import TYPES from 'constants/action-types'
import { LOCATION_CHANGE } from 'react-router-redux'

const initState = fromJS({
	categories: { 'LOW_BLOOD': '低血壓' },
  // types: null,
	types: {
    [TYPES.SIMULATE_TYPE_SBP]: 'SBP',
    [TYPES.SIMULATE_TYPE_TIME_SERIES]: 'Time Series'
  }, //null, //SBP1
	selectedCategory: 'LOW_BLOOD', // null,
	selectedType: TYPES.SIMULATE_TYPE_SBP,
	observor: TYPES.SIMULATE_TYPE_SBP,
	obTime: null,
	// data
  actualFirstRecord: null,
	actual: {},
	predict: {},
	simulate: {},
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
				return state.merge({ selectedType: action.selectedType, simulate: {}, obTime: null })
			}
			break
		case TYPES.SIMULATE_ACTUAL_SUCCESS: {
			let { result } = action
			let actual
      let actualFirstRecord
      let rows

			if (result && result.rows) {
				rows = result.rows.reduce((prev, currRow) => {
					// time is type of long, need to convert it to a number
          const time = currRow.time.toNumber()
					prev[time] = { ...currRow, time }
					return prev
				}, {})

        // set first record
        result.rows[0] && result.rows[0].time && (actualFirstRecord = { ...result.rows[0], time: result.rows[0].time.toNumber() })
        actual = {
          key: new Date().valueOf(),
          rows,
        }
			}

			return state.merge({
				requestActualStatus: action.type,
				actual,
        actualFirstRecord,
        obTime: null,
			})
    }
    case TYPES.SIMULATE_PREDICT_SUCCESS: {
      const { result } = action
      let predictStartTime
      let rows

      result && result.time && (predictStartTime = result.time.toNumber())
      result && result.rows && Array.isArray(result.rows) && (rows = result.rows.map(r => ({ ...r })))
      return state.merge({
        requestPredictStatus: action.type,
        observor: state.get('selectedType'),
        predict: {
          key: new Date().valueOf(),
          startTime: predictStartTime,
          rows: rows,
        },
        obTime: null,
      })
    }
    case TYPES.SIMULATE_SET_OB_TIME: {
      return state.set('obTime', action.dValue)
    }
    case TYPES.SIMULATE_SIMULATE_SUCCESS: {
      const { result } = action
      let simulateStartTime
      let rows

      result && result.time && (simulateStartTime = result.time.toNumber())
      result && result.rows && Array.isArray(result.rows) && (rows = result.rows.map(r => ({ ...r })))
      return state.merge({
        simulateStatus: action.type,
        simulate: {
          key: new Date().valueOf(),
          startTime: simulateStartTime,
          rows: rows,
        },
      })
    }
    case TYPES.LOCATION_CHANGE:
      return initState
    case TYPES.SIMULATE_SET_OBSERVOR:
      return state.set('observor', state.get('selectedType'))
    case TYPES.SIMULATE_CLEAR_SIMULATE_DATA:
      return state.set('simulate', Map({}))
	}

	return state
}

