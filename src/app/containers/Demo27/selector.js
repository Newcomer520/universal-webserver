import { createSelector } from 'reselect'
import d3 from 'd3'
import TYPES from 'constants/action-types'

const actualSelector = createSelector(
  state => state.simulate.get('actual'),
  actual => {
    const obj = actual.toJS()
    obj.rows && (obj.rows = Object.keys(obj.rows).map(p => ({ x: obj.rows[p].time, y: obj.rows[p].sbp })).sort((a, b) => (a.x - b.x)))
    return obj
    // return Object.keys(obj).map(p => ({ x: obj[p].time, y: obj[p].sbp })).sort((a, b) => (a.x - b.x))
  }
)

const predictSelector = createSelector(
  state => state.simulate.get('predict'),
  predict => predict.toJS()
)

const simulatorSelector = createSelector(
  state => state.simulate.get('simulate'),
  simulator => simulator.toJS()
)


export default createSelector(
  state => state.simulate,
  actualSelector,
  predictSelector,
  simulatorSelector,
  (simulate, actual, predict, simulator) => {
    const categories = simulate.get('categories')
    const types = simulate.get('types')
    const timeFormat = d3.time.format("%H:%M")
    const ret = {
      categories: [],
      selectedCategory: simulate.get('selectedCategory'),
      types: [],
      selectedType: simulate.get('selectedType'),
      observor: simulate.get('observor'),
      obRawTime: simulate.get('obTime'), // valueOf的值
      obTime: simulate.get('obTime'),
      obActual: '─',
      obPredict: '─',
      obDiff: '─',
      requestStatus: simulate.get('requestPredictStatus'),
      actual,
      predict,
      simulate: simulator,
    }

    categories.forEach((label, key) => ret.categories.push({ label, value: key }))
    types && types.forEach((label, key) => ret.types.push({ label, value: key }))

    if (ret.observor && ret.obTime) {
      let tempData
      let idx
      tempData = simulate.get('actual').get('rows').get(ret.obTime.toString())
      tempData && (ret.obActual = tempData.get(observorKey(ret.observor)))
      idx = (ret.obTime - simulate.get('predict').get('startTime')) / 60 / 1000
      if (idx >= 0) {
        tempData = simulate.get('predict').get('rows').get(idx)
        if (tempData) {
          ret.obPredict = parseInt(tempData.get('fit'))
        }
        tempData = simulate.get('actual').get(ret.obTime.toString())
        if (tempData) {
          ret.obActual = tempData.get(observorKey(ret.selectedType))
        }
        if (ret.obActual != '─' && ret.obPredict != '─') {
          ret.obDiff = parseInt((ret.obPredict - ret.obActual) / ret.obActual * 100) + '%'
        }
      }

      ret.obTime = timeFormat(new Date(ret.obTime))
    } else {
      ret.obTime = '─'
    }

    return ret
  }
)

function observorKey(observor) {
  switch (observor) {
    case TYPES.SIMULATE_TYPE_SBP:
      return 'sbp'
  }
  return 'null'
}
