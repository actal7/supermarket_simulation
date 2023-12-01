export default (actions, type) => {
  if (actions === undefined)
    throw new Error("Actions object is undefined for target");
  if (type === undefined)
    throw new Error("Message type is undefined for target");

  if (Object.keys(actions).find((key) => key === type) === undefined)
    throw new Error("Message type is not valid for target: " + type);
  actions[type]();
};
