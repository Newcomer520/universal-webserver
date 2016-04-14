
export default values => {
  return {
    ...validateConductivity(values),
    ...validateDiaTempValue(values),
    ...validateUf(values),
    ...validateBloodSpeed(values),
    ...validateLiquidDensity(values),
    ...validateLiquidSpeed(values),
    ...validatePressure(values),
  }
}

function validateRequired(values, field, errors, errMessage = 'Required') {
  if (!values[field]) {
    errors[field] = errMessage
  }

  return errors
}

function validateMinMax(values, field, min, max, errors, errMsg) {
  if (values[field] < min || values[field] > max) {
    errors[field] = errMsg
  }
  return errors
}

function validateConductivity(values) {
  const errors = {}
  const field = 'conductivity'
  const errMsg = 'Conductivity should be between 12 and 16.'
  validateMinMax(values, field, 12, 16, errors, errMsg)
  validateRequired(values, 'conductivity', errors, errMsg)
  return errors
}

function validateDiaTempValue(values) {
  const errors = {}
  const field = 'dia_temp_value'
  const errMsg = 'Temperature should be between 32 and 40'
  validateMinMax(values, field, 32, 40, errors, errMsg)
  return validateRequired(values, field, errors, errMsg)
}

function validateUf(values) {
  const errors = {}
  const field = 'uf'
  const errMsg = '脫水率 should be between 0 and 3'
  validateMinMax(values, field, 0, 3, errors, errMsg)
  return validateRequired(values, field, errors, errMsg)
}

function validateBloodSpeed(values) {
  const errors = {}
  const field = 'fakeBloodSpeed'
  const errMsg = '血液流速 should be between 0 and 400'
  validateMinMax(values, field, 0, 400, errors, errMsg)
  return validateRequired(values, field, errors, errMsg)
}

function validateLiquidDensity(values) {
  const errors = {}
  const field = 'fakeLiquidDensity'
  const errMsg = '透析液濃度 can only be 2.5, 3 or 3.5.'
  if (values[field] && [2.5, 3, 3.5].indexOf(parseFloat(values[field])) === -1) {
    errors[field] = errMsg
  }
  // validateMinMax(values, field, 0, 400, '透析液濃度 should be between 0 and 400', errors)
  return validateRequired(values, field, errors, errMsg)
}

function validateLiquidSpeed(values) {
  const errors = {}
  const field = 'fakeLiquidSpeed'
  const errMsg = '透析液流速 should be between 500 and 1000'
  validateMinMax(values, field, 500, 1000, errors, errMsg)
  return validateRequired(values, field, errors, errMsg)
}

function validatePressure(values) {
  const errors = {}
  const field = 'fakePressure'
  const errMsg = '膜上壓 should be between -400 and 350'
  validateMinMax(values, field, -400, 350, errors, errMsg)
  return validateRequired(values, field, errors, errMsg)
}
