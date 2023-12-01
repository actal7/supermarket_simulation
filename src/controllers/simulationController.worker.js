import Message from "../Utils/Message";
import messageHandler from "../Utils/MessageHandler";

const start = () => {
  console.log("starting");
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

onmessage = (e) => {
  postMessage(new Message("main", "test"));
  messageHandler("simController", actions, e.data);
};
