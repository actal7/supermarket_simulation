import Message from "../Utils/Message";

self.onmessage = (e) => {
  let payload = e.data.payload;
  let simulation = new StoreSimulation({
    employeeWage: payload.employeeWage,
    employeeCount: payload.employeeCount,
    aisleCount: payload.aisleCount,
    registerCount: payload.registerCount,
    employeeBreak: 15,
    clientsPeak: payload.clientsPeak,
    openHours: payload.hoursOpen,
  });

  const result = simulation.runSimulation();
  console.log(result);
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
    this.totalTimeSpentInStore = 0;
    this.totalTimeSpentInRegister = 0;
    this.timeLeftInRegister = 0;
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
    this.breaksTaken = 0;
    this.currentTask = null;
    this.timeSinceLastBreak = 0;
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
  }
}

class StoreSimulation {
  constructor(inputData) {
    this.employeeWage = inputData.employeeWage;
    this.employeeCount = inputData.employeeCount;
    this.aisleCount = inputData.aisleCount;
    this.registerCount = inputData.registerCount;
    this.employeeSpeed = Math.sqrt((1 / inputData.employeeWage) * 20);
    this.employeeBreak = inputData.employeeBreak;
    this.clientsPeak = inputData.clientsPeak;
    this.openHours = inputData.openHours;
    this.totalRuntime = inputData.openHours * 60;
    this.distributionOfTimeSpent = Array.from({ length: 30 }, (_, i) => i + 1);
    this.distributionOfClients = this.generateClientsDistribution(
      inputData.clientsPeak,
      this.totalRuntime
    );
    this.employees = this.createEmployeePool();
    this.taskUpdateTime = 10;
    this.priorityUpdateTime = 60;

    // client stats
    this.totalPotentialClients = this.distributionOfClients.reduce(
      (acc, curr) => acc + curr,
      0
    );
    this.totalServedClients = 0;
    this.averageClientWaitTime = 0;
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
    const sigma = peak / 3;
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

  createEmployeePool() {
    const pool = [];
    for (let i = 0; i < this.employeeCount; i++) {
      pool.push({
        speed: this.employeeSpeed,
        onBreak: false,
      });
    }
    return pool;
  }

  simulateTick(tick) {
    const potentialClients = this.distributionOfClients[tick];

    if (tick % 60 === 0) {
      // Add new clients
    }

    if (tick % this.taskUpdateTime === 0) {
      // Update tasks
    }

    if (tick % this.priorityUpdateTime === 0) {
      // Update priority
      // Assign tasks
    }
  }

  calculatePriorities() {}

  // (this is what I fear most lmao)
  assignTasks() {}

  updateTasks() {}

  runSimulation() {
    const startTime = Date.now();

    for (let tick = 0; tick < this.totalRuntime; tick++) {
      this.simulateTick(tick);
    }

    const endTime = Date.now();
    // console.log(
    //   this.distributionOfClients,
    //   this.distributionOfClients.reduce((acc, curr) => acc + curr, 0)
    // );

    // console.log(
    //   this.distributionOfTimeSpent,
    //   this.distributionOfTimeSpent.reduce((acc, curr) => acc + curr, 0)
    // );
    const totalClients = this.distributionOfClients.reduce(
      (acc, curr) => acc + curr,
      0
    );
    return {
      timeToComplete: endTime - startTime,
      totalClients,
      averageClientsPerMinute: totalClients / (this.openHours * 60),
      profit: 10,
    };
  }
}

// let simulation = new StoreSimulation({
//   employeeWage: 15,
//   employeeCount: 10,
//   aisleCount: 5,
//   registerCount: 3,
//   employeeBreak: 15,
//   clientsPeak: 8,
//   openHours: 8,
// });

// // HAOS
// self.onmessage = (e) => {
//   console.log(e.data);
//   let simulation = new StoreSimulation(
//     15,
//     10,
//     5,
//     3,
//     15,
//     8,
//     e.data.payload.hoursOpen
//   );
//   const result = simulation.runSimulation();
//   postMessage(new Message("simController", "finishDay", result));
//   simulation = null;
// };

// /**
//   client class
//     time left in store
//     total time spent in store
//     total time spent in register
//     time left in register
//     when time left in store = 0 -> find register
//     when time left in register = 0 -> leave store and pay
// */
// class Client {
//   constructor() {
//     this.timeLeftInStore = 0;
//     this.totalTimeSpentInStore = 0;
//     this.totalTimeSpentInRegister = 0;
//     this.timeLeftInRegister = 0;
//   }
// }

// /**
//   employee class
//     breaks taken
//     current task
//     time since last break
//     break priority -> time since last break * 10
//     if priority becomes maintenance and least busy register -> close register for new clients -> go to maintenance
//   */
// class Employee {
//   constructor() {
//     this.breaksTaken = 0;
//     this.currentTask = null;
//     this.timeSinceLastBreak = 0;
//   }
// }

// /**
// aisle class
//   priorityScore = time left in maintenance * 10 + time since last maintenance
//   time since last maintenance
//   needs maintenance: true/false
//   time left in maintenance
// */
// class Aisle {
//   constructor() {
//     this.priorityScore = 0;
//     this.timeSinceLastMaintenance = 0;
//     this.needsMaintenance = false;
//     this.timeLeftInMaintenance = 0;
//   }
// }

// /**
// register class
//   state -> open/working/closed
//   clientsQueue -> array of clients
//   priorityScore = totalTimeToCompleteClients
// */
// class Register {
//   constructor() {
//     this.state = "open";
//     this.clientsQueue = [];
//     this.priorityScore = 0;
//   }
// }

// class StoreSimulation {
//   constructor(
//     employeeWage,
//     employeeCount,
//     aisleCount,
//     registerCount,
//     employeeBreak,
//     employeePeak,
//     openHours
//   ) {
//     this.employeeWage = employeeWage;
//     this.employeeCount = employeeCount;
//     this.aisleCount = aisleCount;
//     this.registerCount = registerCount;
//     this.employeeSpeed = Math.sqrt((1 / employeeWage) * 20);
//     this.employeeBreak = employeeBreak;
//     this.employeePeak = employeePeak;
//     this.openHours = openHours;
//     this.totalRuntime = openHours * 60;
//     this.distributionOfTimeSpent = Array.from({ length: 30 }, (_, i) => i + 1);
//     this.distributionOfClients = this.generateClientsDistribution(
//       employeePeak,
//       this.totalRuntime
//     );
//     this.employees = this.createEmployeePool();
//     this.taskUpdateTime = 10;
//     this.priorityUpdateTime = 60;
//   }

//   // works out to about the mean of the distribution if it's linear <3
//   weightedPick(arr) {
//     const r = Math.random() * arr.length;
//     for (let i = 0; i < arr.length; i++) {
//       if (r < arr[i]) return arr[i];
//     }
//     return arr[arr.length - 1];
//   }

//   generateClientsDistribution(peak, granularity) {
//     const mean = peak;
//     const sigma = peak / 3;
//     const step = (2 * peak) / (granularity - 1);
//     const gaussian = (x) => {
//       let variance = Math.random() * Math.floor(Math.random() * 10);
//       let v = Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2)) * peak;
//       let finalV;
//       if (variance > 2) {
//         finalV = Math.round(v);
//       } else if (variance > 1) {
//         finalV = Math.round((v * variance) / 10);
//       } else {
//         finalV = 0;
//       }

//       return finalV;
//     };

//     return Array.from({ length: granularity }, (_, i) => gaussian(i * step));
//   }

//   createEmployeePool() {
//     const pool = [];
//     for (let i = 0; i < this.employeeCount; i++) {
//       pool.push({
//         speed: this.employeeSpeed,
//         onBreak: false,
//       });
//     }
//     return pool;
//   }

//   simulateTick(tick) {
//     const cDistribution = this.distributionOfClients[tick];

//     if (tick % 60 === 0) {
//       // Add new clients
//     }

//     if (tick % this.taskUpdateTime === 0) {
//       // Update tasks
//     }

//     if (tick % this.priorityUpdateTime === 0) {
//       // Update priority
//       // Assign tasks
//     }
//   }

//   calculatePriorities() {}

//   // (this is what I fear most lmao)
//   assignTasks() {}

//   updateTasks() {}

//   runSimulation() {
//     const startTime = Date.now();

//     for (let tick = 0; tick < this.totalRuntime; tick++) {
//       this.simulateTick(tick);
//     }

//     const endTime = Date.now();
//     // console.log(
//     //   this.distributionOfClients,
//     //   this.distributionOfClients.reduce((acc, curr) => acc + curr, 0)
//     // );

//     // console.log(
//     //   this.distributionOfTimeSpent,
//     //   this.distributionOfTimeSpent.reduce((acc, curr) => acc + curr, 0)
//     // );
//     return {
//       timeToComplete: endTime - startTime,
//       totalClients: this.distributionOfClients.reduce(
//         (acc, curr) => acc + curr,
//         0
//       ),
//       profit: 10,
//       totalMinutesWithClients: this.totalMinutesWithClients,
//     };
//   }
// }
