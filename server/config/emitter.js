import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

emitter.setMaxListeners(0);

export { emitter };
