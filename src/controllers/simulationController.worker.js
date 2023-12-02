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

// this took way too long to figure out. I need to sleep. And eat. And sleep.
async function batchSimulations(payload) {
  const startTime = Date.now();
  let totalTime = 0;
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
      let workerIndex =
        (i * (payload.maxEmployees - payload.minEmployees + 1) + j) %
        maxBatchSize;
      let worker = workerPool[workerIndex];

      let simulationPromise = new Promise((resolve, reject) => {
        const handleMessage = (e) => {
          totalTime += e.data.payload.timeToComplete;
          console.log(
            `Simularea [${i}-${j}] a fost terminata in ${e.data.payload.timeToComplete}`
          );
          console.log(e.data.payload);
          worker.removeEventListener("message", handleMessage);
          resolve();
        };
        worker.addEventListener("message", handleMessage);
        worker.onerror = (e) => {
          worker.removeEventListener("message", handleMessage);
          reject(e);
        };
        worker.postMessage(new Message("simDay", "start", payload));
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

  console.log(`Timpul total de simulare a fost de ${totalTime}`);
  console.log(
    `Timpul mediu de simulare a fost de ${totalTime / totalSimulations}`
  );
  console.log(`Numarul total de simulari a fost de ${totalSimulations}`);
  console.log(
    `Timpul total de executie a fost de ${(endTime - startTime) / 1000}s`
  );
}

onmessage = (e) => {
  messageHandler("simController", actions, e.data);
};
