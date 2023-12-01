import "../styles/styles.css";
import Message from "./Utils/Message";
import messageHandler from "./Utils/MessageHandler";
import UIController from "./controllers/UIController";

const uc = new UIController();
console.log(uc.getSimulationConfig());

window.addEventListener("message", (e) => {
  messageHandler("main", { start: () => console.log("in main") }, e.data);
});

// Init the simulation controller worker
const simController = new Worker(
  new URL("./controllers/simulationController.worker.js", import.meta.url)
);

// Init the message handler for the simulation controller
simController.onmessage = (e) => {
  messageHandler("main", { test: () => console.log("in main") }, e.data);
};

simController.postMessage(new Message("simController", "start"));
