// deno-lint-ignore-file no-explicit-any no-this-alias

import { Client, EventType } from './types.ts'
import WS from './ws.ts'
import prepare from './utils/prepare.ts'

export default class Callback {
    client: Client;
    server: WS
    data: any
    constructor(cleint: Client, server: WS, data: any) {
        this.client = cleint
        this.server = server
        this.data = data
    }

    async emit(type: EventType, data: any) {
        const message = prepare({ type, data })
        await this.client.sock.send(message)
    }

    


    broadcast(type: EventType, data: any) {
        const self = this
        const message = prepare({ type, data })
        this.server.clients.filter(c => c.CID != self.client.CID).forEach(cl => { cl.sock.send(message) })
    }
}

