import Message from "../Utils/Message";

self.onmessage = (payload) => {
  const result = simulateDay();
  postMessage(new Message("simController", "finishDay", result));
};

function simulateDay() {
  const randomTime = Math.floor(Math.random() * 1000);
  const startTime = Date.now();
  for (let i = 0; i < randomTime; i++) {
    console.log("wasting time");
  }

  const endTime = Date.now();
  return {
    timeToComplete: endTime - startTime,
    profit: 10,
  };

  // return new Promise((resolve) => {
  //   const randomTime = Math.floor(Math.random() * 10);

  //   setTimeout(() => {
  //     resolve({
  //       timeToComplete: randomTime,
  //       profit: 10,
  //     });
  //   }, randomTime);
  // });
}
