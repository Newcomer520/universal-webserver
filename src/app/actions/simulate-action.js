import TYPES from 'constants/action-types'
import fetchObject from '../utils/fetch'
import Protos from 'common/protos'
import { apiActual } from 'app/apis/simulate'

export function selectCategory(selected) {
	return { type: TYPES.SIMULATE_SELECT_CATEGORY, selectedCategory: selected.value }
}


export function selectType(selected) {
	return { type: TYPES.SIMULATE_SELECT_TYPE, selectedType: selected.value }
}

export function fetchActual() {
	const { SIMULATE_ACTUAL_FETCHING, SIMULATE_ACTUAL_SUCCESS, SIMULATE_ACTUAL_FAILED } = TYPES
	return {
		type: TYPES.SAGA_FETCH_ACTION,
		fetch: apiActual(),
		status: [SIMULATE_ACTUAL_FETCHING, SIMULATE_ACTUAL_SUCCESS, SIMULATE_ACTUAL_FAILED],
  }
}

export function fetchSimulate(data) {

}

export function setObTime(date) {
  const dValue = date.valueOf()
  return { type: TYPES.SIMULATE_SET_OB_TIME, dValue: dValue }
}

export const actions = {
	selectCategory,
	selectType,
}
