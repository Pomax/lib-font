/**
 * Simple event manager so people can write the
 * same code in the browser and in Node.
 */
class Event {
  constructor(type, detail = {}, msg) {
    this.type = type;
    this.detail = detail;
    this.msg = msg;
    Object.defineProperty(this, `__mayPropagate`, {
      enumerable: false,
      writable: true,
    });
    this.__mayPropagate = true;
  }
  preventDefault() {
    /* does nothing */
  }
  stopPropagation() {
    this.__mayPropagate = false;
  }
  valueOf() {
    return this;
  }
  toString() {
    return this.msg
      ? `[${this.type} event]: ${this.msg}`
      : `[${this.type} event]`;
  }
}

/**
 * Simple event manager so people can write the
 * same code in the browser and in Node.
 */
class EventManager {
  constructor() {
    this.listeners = {};
  }
  addEventListener(type, listener, useCapture) {
    let bin = this.listeners[type] || [];
    if (useCapture) bin.unshift(listener);
    else bin.push(listener);
    this.listeners[type] = bin;
  }
  removeEventListener(type, listener) {
    let bin = this.listeners[type] || [];
    let pos = bin.findIndex((e) => e === listener);
    if (pos > -1) {
      bin.splice(pos, 1);
      this.listeners[type] = bin;
    }
  }
  dispatch(event) {
    let bin = this.listeners[event.type];
    if (bin) {
      for (let l = 0, e = bin.length; l < e; l++) {
        if (!event.__mayPropagate) break;
        bin[l](event);
      }
    }
  }
}

export { Event, EventManager };
