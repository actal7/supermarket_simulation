import config from "../../config.json";

export default (target, actions, event) => {
  if (event.target === undefined || event.type === undefined)
    throw new Error(`Message is not valid [${event}]`);

  if (config.messageTargets.find((t) => t === target) === undefined)
    throw new Error(`Target is not valid [${target}]`);

  if (event.target !== target) return;

  if (actions === undefined)
    throw new Error(`Actions are not defined for target [${event.type}]`);

  if (Object.keys(actions).find((key) => key === event.type) === undefined)
    throw new Error(
      `Message type [${event.type}] is not valid for target [${event.target}]`
    );
  actions[event.type]();
};
