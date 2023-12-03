import Message from "../Utils/Message";
import messageHandler from "../Utils/MessageHandler";
import config from "../../config.json";

const start = (payload) => {
  startSimulation(payload);
};

const stop = () => {
  console.log("stop");
};

const pause = () => {
  console.log("pause");
};

const resume = () => {
  console.log("resume");
};

const actions = {
  start,
  stop,
  pause,
  resume,
};

function startSimulation(payload) {
  batchSimulations(payload);
}

let simulationResults;

// this took way too long to figure out. I need to sleep. And eat. And sleep.
async function batchSimulations(payload) {
  simulationResults = {};
  const startTime = Date.now();
  let totalTime = 0;
  let totalClients = 0;
  let totalPotentialClients = 0;
  let totalSimulations =
    payload.repetitions * (payload.maxEmployees - payload.minEmployees + 1);
  const maxBatchSize = config.maxBatchSize;
  let workerPool = Array.from(
    { length: maxBatchSize },
    () =>
      new Worker(
        new URL("../simulation/simulationDay.worker.js", import.meta.url)
      )
  );
  let simulationPromises = [];

  for (let i = 0; i < payload.repetitions; i++) {
    for (let j = payload.minEmployees; j <= payload.maxEmployees; j++) {
      if (!simulationResults[j])
        simulationResults[j] = {
          totalProfit: 0,
          totalRevenue: 0,
          totalClientsEntered: 0,
          totalPotentialClients: 0,
          totalTime: 0,
          totalRuns: 0,
        };
      let workerIndex =
        (i * (payload.maxEmployees - payload.minEmployees + 1) + j) %
        maxBatchSize;
      let worker = workerPool[workerIndex];

      let simulationPromise = new Promise((resolve, reject) => {
        const handleMessage = (e) => {
          simulationResults[j].totalProfit += e.data.payload.profit;
          simulationResults[j].totalRevenue += e.data.payload.revenue;
          simulationResults[j].totalClientsEntered +=
            e.data.payload.totalClientsEntered;
          simulationResults[j].totalPotentialClients +=
            e.data.payload.totalPotentialClients;
          simulationResults[j].totalTime += e.data.payload.timeToComplete;
          simulationResults[j].totalRuns++;
          totalTime += e.data.payload.timeToComplete;
          totalClients += e.data.payload.totalClientsEntered;
          totalPotentialClients += e.data.payload.totalPotentialClients;
          worker.removeEventListener("message", handleMessage);
          resolve();
        };
        worker.addEventListener("message", handleMessage);
        worker.onerror = (e) => {
          worker.removeEventListener("message", handleMessage);
          reject(e);
        };
        worker.postMessage(
          new Message("simDay", "start", { ...payload, employeeCount: j })
        );
      });

      simulationPromises.push(simulationPromise);

      if (simulationPromises.length >= maxBatchSize) {
        await Promise.all(simulationPromises);
        simulationPromises = [];
      }
    }
  }

  if (simulationPromises.length > 0) {
    await Promise.all(simulationPromises);
  }

  workerPool.forEach((worker) => worker.terminate());

  const endTime = Date.now();

  let stupidEmoji = "bleh";
  if (totalSimulations < 10) {
    stupidEmoji = "😕";
  } else if (totalSimulations < 100) {
    stupidEmoji = "😐";
  } else if (totalSimulations < 1000) {
    stupidEmoji = "🙂";
  } else if (totalSimulations < 10000) {
    stupidEmoji = "😁";
  } else if (totalSimulations < 100000) {
    stupidEmoji = "💪😎";
  } else if (totalSimulations < 1000000) {
    stupidEmoji = "✨🤩✨";
  } else if (totalSimulations < 10000000) {
    stupidEmoji = "🚀🚀🤯🚀🚀";
  } else {
    stupidEmoji = "🤮";
  }

  console.log("====RESULTS====");
  for (const [key, value] of Object.entries(simulationResults)) {
    console.log("💰 ==== 💰");
    console.log(`Pentru ${key} angajati:`);
    console.log(
      `Profitul mediu a fost de ${(value.totalProfit / value.totalRuns).toFixed(
        4
      )}`
    );
    console.log(
      `Venitul mediu a fost de ${(value.totalRevenue / value.totalRuns).toFixed(
        4
      )}`
    );
    console.log(
      `Nr. clienti intrati in medie ${(
        value.totalClientsEntered / value.totalRuns
      ).toFixed(4)}`
    );
    console.log(
      `Nr. clienti potentiali in medie ${(
        value.totalPotentialClients / value.totalRuns
      ).toFixed(4)}`
    );
    console.log(
      `Timpul mediu de simulare a fost de ${(value.totalTime / 1000).toFixed(
        4
      )}s`
    );
  }

  console.log("📈 ====GENERICE==== 📉");
  const topProfit = Object.entries(simulationResults).reduce((a, b) =>
    a[1].totalProfit > b[1].totalProfit ? a : b
  );
  const employeeCount = topProfit[0];
  console.log(
    `Profitul maxim a fost de ${
      topProfit[1].totalProfit / topProfit[1].totalRuns
    } pentru ${employeeCount} angajati`
  );
  console.log(`Timpul total de simulare a fost de ${totalTime / 1000}s`);
  console.log(
    `Timpul mediu de simulare a fost de ${totalTime / totalSimulations}ms`
  );
  console.log(
    `Numarul total de simulari a fost de ${totalSimulations} ${stupidEmoji}`
  );
  console.log(
    `Timpul total de executie a fost de ${(endTime - startTime) / 1000}s`
  );
  console.log(
    `Clientii intrati in medie ${
      totalClients /
      (payload.repetitions * (payload.maxEmployees - payload.minEmployees + 1))
    }`
  );
  console.log(
    `Clientii potentiali in medie ${
      totalPotentialClients /
      (payload.repetitions * (payload.maxEmployees - payload.minEmployees + 1))
    }`
  );
}

onmessage = (e) => {
  messageHandler("simController", actions, e.data);
};
