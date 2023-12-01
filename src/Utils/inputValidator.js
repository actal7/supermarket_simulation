function validateMinEmployees(minValue = 0, maxValue) {
  const min = parseInt(minValue);
  const max = parseInt(maxValue);
  return (
    (Number.isInteger(min) && Number.isInteger(max) && min <= max) ||
    (Number.isInteger(min) && typeof maxValue === "undefined")
  );
}

function validateMaxEmployees(maxValue = 0, minValue) {
  const min = parseInt(minValue);
  const max = parseInt(maxValue);
  return (
    (Number.isInteger(max) && max > 0 && max >= min) ||
    (Number.isInteger(max) && typeof minValue === "undefined")
  );
}

function validateRegisterCount(value) {
  const registers = parseInt(value);
  return Number.isInteger(registers) && registers > 0;
}

function validateAisleCount(value) {
  const aisles = parseInt(value);
  return Number.isInteger(aisles) && aisles > 0;
}

function validateHoursOpen(value) {
  const hours = parseInt(value);
  return Number.isInteger(hours) && hours > 0 && hours <= 24;
}

function validateClientsPeak(value) {
  const clients = parseInt(value);
  return Number.isInteger(clients) && clients > 0;
}

function validateRepetitionCount(value) {
  const repetitions = parseInt(value);
  return Number.isInteger(repetitions) && repetitions > 0;
}

export {
  validateMinEmployees,
  validateMaxEmployees,
  validateRegisterCount,
  validateAisleCount,
  validateHoursOpen,
  validateClientsPeak,
  validateRepetitionCount,
};
