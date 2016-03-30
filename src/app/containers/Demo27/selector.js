import { createSelector } from 'reselect'

const actualPointsSelector = createSelector(
  state => state.simulate.get('actual'),
  actual => {
    const obj = actual.toJS()
    return Object.keys(obj).map(p => ({ x: obj[p].time, y: obj[p].sbp }))
  }
)

const predictSelector = createSelector(
  state => state.simulate.get('predict'),
  predict => predict.toJS()
)

export default createSelector(
  state => state.simulate,
  actualPointsSelector,
  predictSelector,
  (simulate, actualPoints, predict) => {
    const categories = simulate.get('categories')
    const types = simulate.get('types')
    const ret = {
      categories: [],
      selectedCategory: simulate.get('selectedCategory'),
      types: [],
      selectedType: simulate.get('selectedType'),
      observor: simulate.get('observor'),
      obTime: simulate.get('obTime'),
      obActual: '─',
      obPredict: '─',
      obDiff: '─',
      requestStatus: simulate.get('requestPredictStatus'),
      actualPoints,
      predict,
    }

    categories.forEach((label, key) => ret.categories.push({ label, value: key }))
    types && types.forEach((label, key) => ret.types.push({ label, value: key }))

    if (ret.observor && ret.obTime) {
      let tempData
      tempData = simulate.get('actual').get(ret.obTime)
      tempData && (ret.obActual = tempData.get(observorKey(ret.observor)))
    } else {
      ret.obTime = '─'
    }

    return ret
  }
)
