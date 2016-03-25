import TYPES from 'constants/action-types'

export function selectCategory(selected) {
	return { type: TYPES.SIMULATE_SELECT_CATEGORY, selectedCategory: selected.value }
}


export function selectType(selected) {
	return { type: TYPES.SIMULATE_SELECT_TYPE, selectedType: selected.value }
}


/**
 * simulate the sbp value
 * @param  {[type]}    options.uf   [description]
 * @param  {[type]}    options.age  [description]
 * @param  {...[type]} options.rest [description]
 * @return {[type]}                 [description]
 */
export function sbpSimulate({ uf, age, ...rest }) {

}


export const actions = {
	selectCategory,
	selectType,
	sbpSimulate
}
