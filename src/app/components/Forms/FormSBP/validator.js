
export default values => {
  return {
    ...validateConductivity(values),
    ...validateDiaTempValue(values),
    ...validateDryWater(values),
    ...validateBloodSpeed(values),
    ...validateLiquidDensity(values),
    ...validateLiquidSpeed(values),
    ...validatePressure(values),
  }
}

function validateRequired(values, field, errors) {
  if (!values[field]) {
    errors[field] = 'Required'
  }

  return errors
}

function validateMinMax(values, field, min, max, errMsg, errors) {
  if (values[field] < min || values[field] > max) {
    errors[field] = errMsg
  }
  return errors
}

function validateConductivity(values) {
  const errors = {}
  const field = 'conductivity'
  validateMinMax(values, field, 12, 16, 'Conductivity should be between 12 and 16.', errors)
  validateRequired(values, 'conductivity', errors)
  return errors
}

function validateDiaTempValue(values) {
  const errors = {}
  const field = 'dia_temp_value'
  validateMinMax(values, field, 32, 40, 'Temperature should be between 32 and 40', errors)
  return validateRequired(values, field, errors)
}

function validateDryWater(values) {
  const errors = {}
  const field = 'fakeDryWater'
  validateMinMax(values, field, 0, 3, '脫水率 should be between 0 and 3', errors)
  return validateRequired(values, field, errors)
}

function validateBloodSpeed(values) {
  const errors = {}
  const field = 'fakeBloodSpeed'
  validateMinMax(values, field, 0, 400, '血液流速 should be between 0 and 400', errors)
  return validateRequired(values, field, errors)
}

function validateLiquidDensity(values) {
  const errors = {}
  const field = 'fakeLiquidDensity'
  if (values[field] && [2.5, 3, 3.5].indexOf(parseFloat(values[field])) === -1) {
    errors[field] = '透析液濃度 can only be 2.5, 3 or 3.5.'
  }
  // validateMinMax(values, field, 0, 400, '透析液濃度 should be between 0 and 400', errors)
  return validateRequired(values, field, errors)
}

function validateLiquidSpeed(values) {
  const errors = {}
  const field = 'fakeLiquidSpeed'
  validateMinMax(values, field, 500, 1000, '透析液流速 should be between 500 and 1000', errors)
  return validateRequired(values, field, errors)
}

function validatePressure(values) {
  const errors = {}
  const field = 'fakePressure'
  validateMinMax(values, field, -400, 350, '膜上壓 should be between -400 and 350', errors)
  return validateRequired(values, field, errors)
}
