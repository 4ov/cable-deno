// deno-lint-ignore-file no-explicit-any no-this-alias

import { Request, Response } from 'https://deno.land/x/opine@1.4.0/mod.ts'
import type { EventType, EventCallback, Event, WSI, Client } from './types.ts'
import { encode as _encode, decode } from 'https://esm.sh/msgpack-lite'
import chance from 'https://esm.sh/chance'
import {
    acceptWebSocket,
    isWebSocketCloseEvent,
    WebSocket,
} from "https://deno.land/std@0.97.0/ws/mod.ts";

import prepare from './utils/prepare.ts'
import Callback from './callback.ts'




class WS implements WSI {

    events: Event[] = []

    clients: Client[] = []

    constructor() {

    }

    on(type: EventType, callback: EventCallback) {
        this.events.push({
            type,
            callback
        })
    }


    dispatch(type: EventType, data: any, client: Client) {
        const self = this
        this.events.forEach(event => {

            if (event.type == type) {
                event.callback(new Callback(client, self, data))
            }
        })
    }

    private prepareMessage(message: any, _client: Client) {

        let data = message

        if (data instanceof Uint8Array) {

            try {
                data = decode(data)
                this.dispatch(data.type, data.data, message)

            } catch (err) {
                console.log(err);
            }

        }
    }


    /**
     * @description internal websocket connection handler
     */
    private async h(sock: WebSocket) {
        const CID = chance().google_analytics()

        const client: Client = {
            CID,
            sock
        }
        this.clients.push(client)

        this.dispatch('open', null, client)




        try {
            for await (const ev of sock) {

                if (isWebSocketCloseEvent(ev)) {
                    this.clients = this.clients.filter(c => c.CID != CID)

                    // close.

                    this.dispatch('close', null, client)
                } else {

                    this.prepareMessage(ev, client)
                }
            }
        } catch (_err) {
            this.dispatch('error', null, client)
            this.clients = this.clients.filter(c => c.CID != CID)
            if (!sock.isClosed) {
                this.dispatch('close', null, client)
                await sock.close(1000).catch(console.error);
            }
        }
    }


    handler(req: Request, _res: Response) {
        const self = this
        const { conn, r: bufReader, w: bufWriter, headers } = req;
        acceptWebSocket({
            bufReader,
            bufWriter,
            conn,
            headers
        }).then(self.h.bind(self))
    }


    broadcast(type: EventType, data: any) {
        const message = prepare({ type, data })
        this.clients.forEach(c => c.sock.send(message))
    }


}



export default WS