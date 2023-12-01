import "../styles/styles.css";
import Message from "./Utils/Message";
import messageHandler from "./Utils/MessageHandler";

const simController = new Worker(
  new URL("./controllers/simulationController.worker.js", import.meta.url)
);

simController.onmessage = (e) => {
  messageHandler("main", { test: () => console.log("in main") }, e.data);
};

simController.postMessage(new Message("simController", "start"));
