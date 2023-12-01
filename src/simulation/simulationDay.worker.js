import Message from "../Utils/Message";

// self.onmessage = (payload) => {
//   const randomTime = Math.floor(Math.random() * 10);
//   setTimeout(() => {
//     postMessage(
//       new Message("simController", "finishDay", { timeToComplete: randomTime })
//     );
//     self.close();
//   }, randomTime);
// };

self.onmessage = (payload) => {
  const randomTime = Math.floor(Math.random() * 10);
  setTimeout(() => {
    postMessage(
      new Message("simController", "finishDay", { timeToComplete: randomTime })
    );
  }, randomTime);
};
