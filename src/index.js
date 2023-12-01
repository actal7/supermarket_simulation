import "../styles/styles.css";
import Message from "./Utils/Message";
import messageHandler from "./Utils/MessageHandler";
import UIController from "./controllers/UIController";

const actions = {
  start: () => {
    console.log("starting");
  },
  stop: () => {
    console.log("stop");
  },
  pause: () => {
    console.log("pause");
  },
  resume: () => {
    console.log("resume");
  },
  submitInput: (payload) => {
    console.log(payload);
  },
};

const uc = new UIController();

// Init the simulation controller worker
const simController = new Worker(
  new URL("./controllers/simulationController.worker.js", import.meta.url)
);

// Init the message handler for the simulation controller
simController.onmessage = (e) => {
  messageHandler("main", actions, e.data);
};

window.addEventListener("message", (e) => {
  messageHandler("main", actions, e.data);
});
