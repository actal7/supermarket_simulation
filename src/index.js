import "../styles/styles.css";
import Message from "./Utils/Message";

self.addEventListener("message", (e) => {
  if (e.data.content?.target !== "main") {
    return;
  }

  switch (e.data.content.message) {
    case "start":
      console.log("start");
      break;
    case "stop":
      console.log("stop");
      break;
    case "pause":
      console.log("pause");
      break;
    case "resume":
      console.log("resume");
      break;
    default:
      throw new Error(
        "Message type is not valid for target 'main': " + e.data.content.message
      );
  }
});

const simController = new Worker(
  new URL("./controllers/simulationController.worker.js", import.meta.url)
);

simController.postMessage(new Message("simController", "start"));

// const worker = new Worker(
//   new URL("./controllers/simulationController.worker.js", import.meta.url)
// );
// worker.postMessage(new Message("w1", "ma auzi ma?").getMessage());
