import { opine } from 'https://deno.land/x/opine@1.4.0/mod.ts'



import { Ws } from '../mod.ts'

const app = opine()

const w = new Ws()


w.on('message', ev=>{
    w.broadcast('message', ev.data)
    
})


app.all('/ws', w.handler.bind(w))







app.listen(3000)