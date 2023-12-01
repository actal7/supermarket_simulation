import config from "../../config.json";

export default class Message {
  _targetArray = config.messageTargets;
  _typeArray = config.messageTypes;

  constructor(target, type, content = "") {
    if (target === undefined) {
      throw new Error("Message target is undefined");
    } else if (typeof target !== "string") {
      throw new Error("Message target is not a string: " + target);
    }

    if (type === undefined) {
      throw new Error("Message type is undefined");
    } else if (typeof type !== "string") {
      throw new Error("Message type is not a string: " + type);
    }

    if (typeof content !== "string") {
      throw new Error("Message is not a string: " + content);
    }

    if (this._targetArray.indexOf(target) === -1) {
      throw new Error("Message target is not valid: " + target);
    }

    if (this._typeArray.indexOf(type) === -1) {
      throw new Error("Message type is not valid: " + type);
    }

    return {
      target: target,
      type: type,
      message: content,
      timestamp: Date.now(),
    };
  }
}
