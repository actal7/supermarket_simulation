import Message from "../Utils/Message";
import LinkedList from "../Utils/LinkedList";

self.onmessage = (e) => {
  let payload = e.data.payload;
  let simulation = new StoreSimulation({
    employeeWage: payload.employeeWage,
    employeeCount: payload.employeeCount,
    aisleCount: payload.aisleCount,
    registerCount: payload.registerCount,
    // employeeBreak: 15,
    clientsPeak: payload.clientsPeak,
    openHours: payload.hoursOpen,
  });

  const result = simulation.runSimulation();
  postMessage(new Message("simController", "finishDay", result));
  simulation = null;
};

/**
  client class
    time left in store
    total time spent in store
    total time spent in register
    time left in register
    when time left in store = 0 -> find register
    when time left in register = 0 -> leave store and pay
*/
class Client {
  constructor() {
    this.timeLeftInStore = 0;
    this.initialTimeLeftInStore = 0;
    this.totalTimeSpentInStore = 0;
    this.totalTimeSpentInRegister = 0;
    this.timeLeftInRegister = 0;
  }

  reset() {
    this.timeLeftInStore = 0;
    this.initialTimeLeftInStore = 0;
    this.totalTimeSpentInStore = 0;
    this.totalTimeSpentInRegister = 0;
    this.timeLeftInRegister = 0;
  }

  updateTimeLeftInStore(n) {
    this.timeLeftInStore = parseInt(n);
    this.initialTimeLeftInStore = parseInt(n);
  }
}

/**
  employee class
    breaks taken
    current task
    time since last break
    break priority -> time since last break * 10
    if priority becomes maintenance and least busy register -> close register for new clients -> go to maintenance
  */
class Employee {
  constructor() {
    this.currentTask = null;
    this.currentTaskIndex = null;
  }
}

/**
aisle class
  priorityScore = time left in maintenance * 10 + time since last maintenance
  time since last maintenance
  needs maintenance: true/false
  time left in maintenance
*/
class Aisle {
  constructor() {
    this.priorityScore = 0;
    this.timeSinceLastMaintenance = 0;
    this.needsMaintenance = false;
    this.timeLeftInMaintenance = 0;
  }
}

/**
register class
  state -> open/working/closed
  clientsQueue -> array of clients
  priorityScore = totalTimeToCompleteClients
*/
class Register {
  constructor() {
    this.state = "open";
    this.clientsQueue = [];
    this.priorityScore = 0;
    this.taskTime = 0;
  }

  close() {
    this.state = "closed";
  }

  open() {
    this.state = "open";
  }

  updateTaskTime() {
    if (this.clientsQueue.length > 0) {
      this.taskTime = parseInt(
        this.clientsQueue.reduce(
          (acc, curr) => acc + curr.timeLeftInRegister,
          0
        )
      );
    }
  }

  getTaskTime() {
    return this.taskTime;
  }
}

class StoreSimulation {
  constructor(inputData) {
    // this.employeeWage = inputData.employeeWage;
    this.employeeWage = 10;
    this.employeeCount = inputData.employeeCount;
    this.aisleCount = inputData.aisleCount;
    this.registerCount = inputData.registerCount;
    this.employeeSlowdown = Math.sqrt((1 / inputData.employeeWage) * 20);
    // this.employeeBreak = inputData.employeeBreak;
    this.clientsPeak = inputData.clientsPeak;
    this.openHours = inputData.openHours;
    this.totalRuntime = inputData.openHours * 60;
    this.totalTicks = 0;
    this.distributionOfTimeSpent = Array.from({ length: 30 }, (_, i) => i + 1);
    this.distributionOfClients = this.generateClientsDistribution(
      inputData.clientsPeak,
      this.totalRuntime
    );
    this.employees = this.createEmployees();
    this.taskUpdateTime = 1;
    this.priorityUpdateTime = 4;

    // CLIENTS
    this.maxNumberOfConcomitentClients =
      this.registerCount * this.aisleCount * 5;
    this.clientPool = this.createClientPool();
    this.clientsInShop = new LinkedList();
    this.totalPotentialClients = this.distributionOfClients.reduce(
      (acc, curr) => acc + curr,
      0
    );
    this.totalServedClients = 0;
    this.averageClientWaitTime = 0;
    this.currentClientsCount = 0;

    // REGISTERS
    this.registers = this.createRegisters();
    this.storeBusyLevel = 0;

    // AISLES
    this.aisles = this.createAisles();

    // MISC STATS
    this.totalWorkDone = 0;
    this.totalRevenue = 0;
    this.profit = 0;
    this.totalClientsServed = 0;
    this.totalClientsEntered = 0;
  }

  createClientPool() {
    const pool = [];
    for (let i = 0; i < this.maxNumberOfConcomitentClients; i++) {
      pool.push(new Client());
    }
    return pool;
  }

  createEmployees() {
    let arr = [];
    for (let i = 0; i < this.employeeCount; i++) {
      arr.push(new Employee());
    }
    return arr;
  }

  createRegisters() {
    let arr = [];
    for (let i = 0; i < this.registerCount; i++) {
      arr.push(new Register());
    }
    return arr;
  }

  createAisles() {
    let arr = [];
    for (let i = 0; i < this.aisleCount; i++) {
      arr.push(new Aisle());
    }
    return arr;
  }

  // works out to about the mean of the distribution if it's linear <3
  weightedPick(arr) {
    const r = Math.random() * arr.length;
    for (let i = 0; i < arr.length; i++) {
      if (r < arr[i]) return arr[i];
    }
    return arr[arr.length - 1];
  }

  generateClientsDistribution(peak, granularity) {
    const mean = peak;
    const sigma = peak / 2;
    const step = (2 * peak) / (granularity - 1);

    const gaussian = (x) => {
      let variance = Math.random() * Math.floor(Math.random() * 10);
      let v = Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2)) * peak;
      let finalV;
      if (variance > 2) {
        finalV = Math.round(v);
      } else if (variance > 1) {
        finalV = Math.round((v * variance) / 10);
      } else {
        finalV = 0;
      }
      return finalV;
    };

    return Array.from({ length: granularity }, (_, i) => gaussian(i * step));
  }

  simulateTick(tick) {
    this.totalTicks++;

    if (tick % this.taskUpdateTime === 0) {
      this.introduceNewClients(tick);

      // UPDATE CLIENT TIME LEFT IN STORE
      this.updateClientTimeLeftInStore();

      this.assignTasks();
      // WERK WERK
      this.work();
      if (tick % this.priorityUpdateTime === 0) {
        this.assignTasks();
      }
    }
  }

  work() {
    this.employees.forEach((employee) => {
      let saveIndex = employee.currentTaskIndex;
      if (employee.currentTask === "register") {
        const client =
          this.registers[employee.currentTaskIndex].clientsQueue[0];
        if (!client) return;
        if (
          this.registers[employee.currentTaskIndex].clientsQueue.length !== 0
        ) {
          client.timeLeftInRegister--;
        }
        // is the client done?
        if (client.timeLeftInRegister <= 0) {
          this.registers[employee.currentTaskIndex].clientsQueue.shift();

          // is the register queue finished?
          if (
            this.registers[employee.currentTaskIndex].clientsQueue.length === 0
          ) {
            employee.currentTask = null;
            employee.currentTaskIndex = null;
            this.assignTasks();
          }
          this.currentClientsCount--;
          this.totalClientsServed++;
          this.totalRevenue += client.initialTimeLeftInStore * 2;
          client.reset();
          this.clientPool.push(client);
        }
        this.totalWorkDone++;
        this.registers[saveIndex].updateTaskTime();
      }
    });
  }

  introduceNewClients(tick) {
    let clientsToEnter = 0;
    const potentialClients = this.distributionOfClients[tick];

    if (this.currentClientsCount < this.maxNumberOfConcomitentClients) {
      clientsToEnter = Math.min(
        potentialClients,
        this.maxNumberOfConcomitentClients - this.currentClientsCount
      );
      this.currentClientsCount += clientsToEnter;
    }

    this.totalClientsEntered += clientsToEnter;

    for (let i = 0; i < clientsToEnter; i++) {
      if (this.clientPool.length === 0) this.clientPool.push(new Client());
      const client = this.clientPool.pop();
      client.updateTimeLeftInStore(
        this.weightedPick(this.distributionOfTimeSpent)
      );
      this.clientsInShop.append(client);
    }
  }

  assignTasks() {
    const taskPriorities = this.calculateTaskPriorities();

    // Sort tasks by priority (highest first)
    taskPriorities.sort((a, b) => b.priority - a.priority);

    // Assign tasks to available employees
    this.employees.forEach((employee) => {
      if (!employee.currentTask) {
        const task = taskPriorities.find((t) => !t.assigned);
        if (task) {
          employee.currentTask = task.type;
          employee.currentTaskIndex = task.index;
          task.assigned = true;
          // Additional task assignment logic here
        }
      }
    });
  }

  calculateTaskPriorities() {
    let priorities = [];

    this.registers.forEach((register, index) => {
      const registerTask = {
        type: "register",
        index: index,
        priority: register.getTaskTime(),
        assigned: false,
      };

      register.updateTaskTime();
      if (
        this.registers.find((reg) => reg.state === "open") == undefined &&
        this.clientsInShop.length > this.registerCount * 2
      ) {
        priorities.push(registerTask);
      } else if (
        this.getLeastBusyRegister() === -1 &&
        this.clientsInShop.length > this.registerCount * 2
      ) {
        priorities.push(registerTask);
      } else if (register.getTaskTime() > 0) {
        priorities.push(registerTask);
      }
    });

    this.aisles.forEach((aisle, index) => {
      if (aisle.needsMaintenance) {
        priorities.push({
          type: "aisle",
          index: index,
          priority:
            aisle.timeLeftInMaintenance * 10 + aisle.timeSinceLastMaintenance,
          assigned: false,
        });
      }
    });

    // alte task-uri? nah

    return priorities;
  }

  updateClientTimeLeftInStore() {
    let current = this.clientsInShop.head;

    while (current) {
      current.value.timeLeftInStore--;
      current.value.totalTimeSpentInStore++;
      if (current.value.timeLeftInStore <= 0) {
        if (this.getLeastBusyRegister() !== -1) {
          current.value.timeLeftInStore = 0;
          this.clientsInShop.remove(current);
          this.queueClient(current.value);
        }
      }
      current = current.value.next;
    }
  }

  queueClient(client) {
    const register = this.getLeastBusyRegister();
    // @TODO maybe too little time left in register
    client.timeLeftInRegister = parseInt(client.initialTimeLeftInStore + 1);
    register.clientsQueue.push(client);
  }

  getLeastBusyRegister() {
    let min = Number.MAX_SAFE_INTEGER;
    let leastBusyRegister = 0;
    for (let i = 0; i < this.registers.length; i++) {
      if (this.registers[i].state === "closed") continue;
      this.registers[i].updateTaskTime();
      if (this.registers[i].getTaskTime() < min) {
        leastBusyRegister = i;
        min = this.registers[i].getTaskTime();
      }
    }

    return min < 30 ? this.registers[leastBusyRegister] : -1;
  }

  runSimulation() {
    const startTime = Date.now();

    for (let tick = 0; tick < this.totalRuntime; tick++) {
      this.simulateTick(tick);
    }

    const endTime = Date.now();

    const totalClients = this.distributionOfClients.reduce(
      (acc, curr) => acc + curr,
      0
    );

    return {
      timeToComplete: endTime - startTime,
      totalPotentialClients: this.totalPotentialClients,
      totalClientsEntered: this.totalClientsEntered,
      totalClientsServed: this.totalClientsServed,
      averageClientsPerMinute: totalClients / (this.openHours * 60),
      profit:
        this.totalRevenue -
        parseInt(this.employeeCount) *
          parseInt(this.employeeWage) *
          parseInt(this.openHours),
      revenue: this.totalRevenue,
    };
  }
}
