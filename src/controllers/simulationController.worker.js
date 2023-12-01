import messageHandler from "../Utils/handlers";

self.onmessage = (e) => {
  if (e.data.target === "simController") {
    messageHandler(
      {
        start: () => {
          console.log("start din simController");
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
      },
      e.data.type
    );
  }
};
