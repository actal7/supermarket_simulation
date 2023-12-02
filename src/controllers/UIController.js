import { max } from "simple-statistics";
import Message from "../Utils/Message";
import * as iv from "../Utils/inputValidator.js";
import {
  minEmployeesInput,
  maxEmployeesInput,
  registerCountInput,
  aisleCountInput,
  hoursOpenInput,
  clientsPeakInput,
  simulationButton,
  initEventListeners,
  repetitionCountInput,
} from "../Utils/selectedElements";

// @TODO maybe validate all this data before sending it to the worker
// @TODO error handling lmao that'd be funny

let inputData = {
  minEmployees: parseInt(minEmployeesInput.value),
  maxEmployees: parseInt(maxEmployeesInput.value),
  registerCount: parseInt(registerCountInput.value),
  aisleCount: parseInt(aisleCountInput.value),
  hoursOpen: parseInt(hoursOpenInput.value),
  clientsPeak: parseInt(clientsPeakInput.value),
  repetitions: parseInt(repetitionCountInput.value),
};

console.log(inputData);

export default class UIController {
  init() {
    initEventListeners(
      this.handleMinEmployeesChange.bind(this),
      this.handleMaxEmployeesChange.bind(this),
      this.handleRegisterCountChange.bind(this),
      this.handleAisleCountChange.bind(this),
      this.handleHoursOpenChange.bind(this),
      this.handleClientsPeakChange.bind(this),
      this.handleRepetitionCountChange.bind(this),
      this.handleSimulationStart.bind(this)
    );
  }

  handleMinEmployeesChange(e) {
    console.log(e.target.value);
    if (iv.validateMinEmployees(e.target.value, this.maxEmployees)) {
      this.minEmployees = parseInt(e.target.value);
    } else {
      console.error("invalid min employees");
      this.minEmployees = null;
    }
    inputData.minEmployees = this.minEmployees;
  }

  handleMaxEmployeesChange(e) {
    if (iv.validateMaxEmployees(e.target.value, this.minEmployees)) {
      this.maxEmployees = parseInt(e.target.value);
    } else {
      console.error("invalid max employees");
      this.maxEmployees = null;
    }
    inputData.maxEmployees = this.maxEmployees;
  }

  handleRegisterCountChange(e) {
    if (iv.validateRegisterCount(e.target.value)) {
      this.registerCount = parseInt(e.target.value);
    } else {
      console.error("invalid register count");
      this.registerCount = null;
    }
    inputData.registerCount = this.registerCount;
  }

  handleAisleCountChange(e) {
    if (iv.validateAisleCount(e.target.value)) {
      this.aisleCount = parseInt(e.target.value);
    } else {
      console.error("invalid aisle count");
      this.aisleCount = null;
    }
    inputData.aisleCount = this.aisleCount;
  }

  handleHoursOpenChange(e) {
    if (iv.validateHoursOpen(e.target.value)) {
      this.hoursOpen = parseInt(e.target.value);
    } else {
      console.error("invalid hours open");
      this.hoursOpen = null;
    }
    inputData.hoursOpen = this.hoursOpen;
  }

  handleClientsPeakChange(e) {
    if (iv.validateClientsPeak(e.target.value)) {
      this.clientsPeak = parseInt(e.target.value);
    } else {
      console.error("invalid clients peak");
      this.clientsPeak = null;
    }
    inputData.clientsPeak = this.clientsPeak;
  }

  handleRepetitionCountChange(e) {
    if (iv.validateRepetitionCount(e.target.value)) {
      this.repetitionCount = parseInt(e.target.value);
    } else {
      console.error("invalid repetition count");
      this.repetitionCount = null;
    }
    inputData.repetitions = this.repetitionCount;
  }

  handleSimulationStart() {
    console.log("submit: ", inputData);
    window.postMessage(new Message("main", "submitInput", inputData));
  }
}
