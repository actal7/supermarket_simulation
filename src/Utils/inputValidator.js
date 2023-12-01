function validateMinEmployees(value) {
  return Number.isInteger(parseInt(value)) && parseInt(value) > 0;
}

function validateMaxEmployees(minValue, maxValue = 0) {
  let min = parseInt(minValue);
  let max = parseInt(maxValue);
  return Number.isInteger(max) && max > 0 && max >= min;
}

function validateRegisterCount(value) {
  return Number.isInteger(parseInt(value)) && parseInt(value) > 0;
}

function validateAisleCount(value) {
  return Number.isInteger(parseInt(value)) && parseInt(value) > 0;
}

function validateHoursOpen(value) {
  let hours = parseInt(value);
  return Number.isInteger(hours) && hours > 0 && hours <= 24;
}

function validateClientsPeak(value) {
  return Number.isInteger(value) && value > 0;
}

export {
  validateMinEmployees,
  validateMaxEmployees,
  validateRegisterCount,
  validateAisleCount,
  validateHoursOpen,
  validateClientsPeak,
};
