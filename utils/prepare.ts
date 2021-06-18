// deno-lint-ignore-file no-explicit-any

import { encode } from 'https://esm.sh/msgpack-lite'



export default  (data: any) => {
    return encode(data)
}

