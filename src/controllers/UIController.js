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
};

export default class UIController {
  constructor() {
    initEventListeners(
      this.handleMinEmployeesChange.bind(this),
      this.handleMaxEmployeesChange.bind(this),
      this.handleRegisterCountChange.bind(this),
      this.handleAisleCountChange.bind(this),
      this.handleHoursOpenChange.bind(this),
      this.handleClientsPeakChange.bind(this),
      this.handleSimulationStart.bind(this)
    );
  }

  handleMinEmployeesChange(e) {
    console.log(e.target.value);
    if (iv.validateMinEmployees(e.target.value, this.maxEmployees)) {
      this.minEmployees = e.target.value;
    } else {
      console.error("invalid min employees");
    }
  }

  handleMaxEmployeesChange(e) {
    if (iv.validateMaxEmployees(e.target.value, this.minEmployees)) {
      this.maxEmployees = e.target.value;
    } else {
      console.error("invalid max employees");
    }
  }

  handleRegisterCountChange(e) {
    if (iv.validateRegisterCount(e.target.value)) {
      this.registerCount = e.target.value;
    } else {
      console.error("invalid register count");
    }
  }

  handleAisleCountChange(e) {
    if (iv.validateAisleCount(e.target.value)) {
      this.aisleCount = e.target.value;
    } else {
      console.error("invalid aisle count");
    }
  }

  handleHoursOpenChange(e) {
    if (iv.validateHoursOpen(e.target.value)) {
      this.hoursOpen = e.target.value;
    } else {
      console.error("invalid hours open");
    }
  }

  handleClientsPeakChange(e) {
    if (iv.validateClientsPeak(e.target.value)) {
      this.clientsPeak = e.target.value;
    } else {
      console.error("invalid clients peak");
    }
  }

  updateInputData() {
    inputData.minEmployees = this.minEmployees;
    inputData.maxEmployees = this.maxEmployees;
    inputData.registerCount = this.registerCount;
    inputData.aisleCount = this.aisleCount;
    inputData.hoursOpen = this.hoursOpen;
    inputData.clientsPeak = this.clientsPeak;
  }

  handleSimulationStart() {
    this.updateInputData();
    window.postMessage(new Message("main", "submitInput", inputData));
  }
}
