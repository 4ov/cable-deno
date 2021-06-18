import { RequestHandler } from "https://deno.land/x/opine@1.4.0/mod.ts";
import { WebSocket } from "https://deno.land/std@0.97.0/ws/mod.ts";
import Callback from './callback.ts'
export type EventType = string | "open" | "close";


export type EventCallback = (event: Callback) => void;

export interface Event {
  type: EventType;
  callback: EventCallback;
}

export interface WSI {
  events: Event[];

  on: (type: EventType, callback: EventCallback) => void;

  handler: RequestHandler;
}

export interface Client {
  sock: WebSocket;
  CID: string;
}
