const minEmployeesInput = document.querySelector(
  ".control-panel__min-employees"
);
const maxEmployeesInput = document.querySelector(
  ".control-panel__max-employees"
);
const registerCountInput = document.querySelector(
  ".control-panel__register-count"
);
const aisleCountInput = document.querySelector(".control-panel__aisle-count");
const hoursOpenInput = document.querySelector(".control-panel__hours");
const clientsPeakInput = document.querySelector(".control-panel__clients-peak");
const repetitionCountInput = document.querySelector(
  ".control-panel__repetitions"
);
const simulationButton = document.querySelector(".control-panel__start-button");

function initEventListeners(
  handleMinEmployees,
  handleMaxEmployees,
  handleRegisterCount,
  handleAisleCount,
  handleHoursOpen,
  handleClientsPeak,
  handleRepetitionCount,
  handleSimulationStart
) {
  minEmployeesInput.addEventListener("change", handleMinEmployees);
  maxEmployeesInput.addEventListener("change", handleMaxEmployees);
  registerCountInput.addEventListener("change", handleRegisterCount);
  aisleCountInput.addEventListener("change", handleAisleCount);
  hoursOpenInput.addEventListener("change", handleHoursOpen);
  clientsPeakInput.addEventListener("change", handleClientsPeak);
  repetitionCountInput.addEventListener("change", handleRepetitionCount);
  simulationButton.addEventListener("click", handleSimulationStart);
}

export {
  minEmployeesInput,
  maxEmployeesInput,
  registerCountInput,
  aisleCountInput,
  hoursOpenInput,
  clientsPeakInput,
  repetitionCountInput,
  simulationButton,
  initEventListeners,
};
