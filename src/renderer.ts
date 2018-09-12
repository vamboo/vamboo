import {wasmBooted, add} from './lib.rs'


wasmBooted.then(() => {
  alert(add(2, 3))
})
