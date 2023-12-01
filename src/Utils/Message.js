import config from "../../config.json";

export default class Message {
  _targetArray = config.messageTargets;
  _typeArray = config.messageTypes;

  constructor(target, type, payload = "") {
    if (target === undefined) {
      throw new Error("Message target is undefined");
    } else if (typeof target !== "string") {
      throw new Error(`Message target is not a string [${target}]`);
    }

    if (type === undefined) {
      throw new Error("Message type is undefined");
    } else if (typeof type !== "string") {
      throw new Error("Message type is not a string: " + type);
    }

    if (typeof payload !== "string" && typeof payload !== "object") {
      throw new Error("Payload is not a string or object" + payload);
    }

    if (this._targetArray.indexOf(target) === -1) {
      throw new Error("Message target is not valid: " + target);
    }

    if (this._typeArray.indexOf(type) === -1) {
      throw new Error("Message type is not valid: " + type);
    }

    return {
      target,
      type,
      payload,
      timestamp: Date.now(),
    };
  }
}
