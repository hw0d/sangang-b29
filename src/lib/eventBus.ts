import { EventEmitter } from "node:events";

const globalForBus = globalThis as unknown as { eventBus?: EventEmitter };

// One shared in-process event bus. Since this app runs as a single Node
// process (Render's free web-service plan doesn't horizontally scale it),
// an in-memory emitter is enough to notify every connected browser tab of a
// data change. If this ever runs across multiple instances, this would need
// to move to Postgres LISTEN/NOTIFY or similar so all instances see it.
export const eventBus = globalForBus.eventBus ?? new EventEmitter();
eventBus.setMaxListeners(0);

if (process.env.NODE_ENV !== "production") globalForBus.eventBus = eventBus;

export function notifyDataChanged() {
  eventBus.emit("change");
}
