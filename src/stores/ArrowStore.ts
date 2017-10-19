import BaseStore from './BaseStore'
import Input from '../lib/Input'
import Output from '../lib/Output'


class ArrowStore extends BaseStore {
  startsFrom: Output<any> | null = null

  constructor() {
    super()
    this.configure()
  }

  start(output: Output<any>) {
    this.startsFrom = output
  }

  finish(input: Input<any>) {
    console.assert(this.startsFrom !== null)

    input.connect(this.startsFrom!)
    this.startsFrom = null
  }
}

export default new ArrowStore
