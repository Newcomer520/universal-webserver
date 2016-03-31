import { createSelector } from 'reselect'

export const fieldNames = {
  conductivity: '電解質濃度', // 12 - 16
  dia_temp_value: '機器溫度', // 32 - 40
  fakeDryWater: '脫水率', // 0 - 3
  fakeBloodSpeed: '血液流速', // (mL/min) 0 - 400
  fakeLiquidDensity: '透析液濃度', // 2.5, 3.5, 4.5
  fakeLiquidSpeed: '透析液流速',
  fakePressure: '膜上壓',
  temperature: null,
  dm: null,
  gender: null,
  dw_weight_ratio: null,
  time: null,
  age: null,
  uf: null,
  bdMedian: null
}

export default createSelector(
  state => state.simulate,
  (simulate) => {
    const time = simulate.get('obTime')
    const currentActual = time? simulate.get('actual').get(time.toString()): null
    const actuals = Object.keys(fieldNames).reduce((prevResult, currentField) => {
      prevResult[currentField] = actualValueGenerator(currentField, currentActual)
      return prevResult
    }, {})
    return { actuals, obTime: time }
  }
)

function actualValueGenerator(key, actualData) {
  if (!actualData) {
    return '─'
  }

  switch (key) {
    case 'fakeDryWater':
      return (Math.random()*3).toFixed(2)
    case 'fakeBloodSpeed':
      return Math.round((Math.random()*400))
    case 'fakeLiquidDensity':
      return [2.5, 3, 3.5][Math.round(Math.random()*2)].toString()
    case 'fakeLiquidSpeed':
      return Math.round((500 + 500 * Math.random())).toString()
    case 'fakePressure':
      return Math.round((-400 + 750 * Math.random())).toString()
    default:
      return actualData.get(key)
  }
}
