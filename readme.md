# `Cable:Deno`
## What?
> A Websocket middleware for [opine](https://github.com) trying to be a socket.io clone as much as possible.

## How?
```js
import { opine } from "https://deno.land/x/opine@1.4.0/mod.ts";
//not uploaded to denoland/x yet
import { Ws } from 'url'

const app = opine()
const ws = new Ws()

ws.on('open', (event)=>{
	event.emit('welcome', 'Welcome client!')
})



app.get('/ws', ws.handle.bind(ws))

app.liste(3000)

```

## Docs?
> Use `deno doc` for now.

## Roadmap
- [x] Start this project
- [ ] Add new methods (short-polling, long-polling, SSE)