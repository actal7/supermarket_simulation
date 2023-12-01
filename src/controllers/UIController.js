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
} from "../Utils/selectedElements";

// @TODO maybe validate all this data before sending it to the worker
// @TODO error handling lmao that'd be funny

let inputData = {
  minEmployees: null,
  maxEmployees: null,
  registerCount: null,
  aisleCount: null,
  hoursOpen: null,
  clientsPeak: null,
  repetitions: null,
};

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
      this.minEmployees = e.target.value;
    } else {
      console.error("invalid min employees");
      this.minEmployees = null;
      inputData.minEmployees = null;
    }
  }

  handleMaxEmployeesChange(e) {
    if (iv.validateMaxEmployees(e.target.value, this.minEmployees)) {
      this.maxEmployees = e.target.value;
    } else {
      console.error("invalid max employees");
      this.maxEmployees = null;
      inputData.maxEmployees = null;
    }
  }

  handleRegisterCountChange(e) {
    if (iv.validateRegisterCount(e.target.value)) {
      this.registerCount = e.target.value;
    } else {
      console.error("invalid register count");
      this.registerCount = null;
      inputData.registerCount = null;
    }
  }

  handleAisleCountChange(e) {
    if (iv.validateAisleCount(e.target.value)) {
      this.aisleCount = e.target.value;
    } else {
      console.error("invalid aisle count");
      this.aisleCount = null;
      inputData.aisleCount = null;
    }
  }

  handleHoursOpenChange(e) {
    if (iv.validateHoursOpen(e.target.value)) {
      this.hoursOpen = e.target.value;
    } else {
      console.error("invalid hours open");
      this.hoursOpen = null;
      inputData.hoursOpen = null;
    }
  }

  handleClientsPeakChange(e) {
    if (iv.validateClientsPeak(e.target.value)) {
      this.clientsPeak = e.target.value;
    } else {
      console.error("invalid clients peak");
      this.clientsPeak = null;
      inputData.clientsPeak = null;
    }
  }

  handleRepetitionCountChange(e) {
    if (iv.validateRepetitionCount(e.target.value)) {
      this.repetitionCount = e.target.value;
    } else {
      console.error("invalid repetition count");
      this.repetitionCount = null;
      inputData.repetitions = null;
    }
  }

  updateInputData() {
    inputData.minEmployees = parseInt(this.minEmployees);
    inputData.maxEmployees = parseInt(this.maxEmployees);
    inputData.registerCount = parseInt(this.registerCount);
    inputData.aisleCount = parseInt(this.aisleCount);
    inputData.hoursOpen = parseInt(this.hoursOpen);
    inputData.clientsPeak = parseInt(this.clientsPeak);
    inputData.repetitions = parseInt(this.repetitionCount);
  }

  handleSimulationStart() {
    this.updateInputData();
    window.postMessage(new Message("main", "submitInput", inputData));
  }
}
