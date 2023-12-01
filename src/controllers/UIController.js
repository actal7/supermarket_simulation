export default class UIController {
  getSimulationConfig() {
    return {
      minEmployees: 1,
      maxEmployees: 10,
      customerPeak: 10,
      registerCount: 3,
      aisleCount: 3,
      employeePay: 10,
    };
  }
}
