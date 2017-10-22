import {BeginBlock, EndBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'
import Subscription from '../Subscription'


export class Begin extends BeginBlock {
  static blockName = 'BEGIN State'

  inputs: Input<number>[] = [new Input<number>('value', 0, this), new Input<number>('initial state', 0, this)]
  outputs: Output<number>[] = [new Output<number>('value', 0, false), new Output<number>('old state', 0, false)]

  constructor() {
    super()

    this.inputs[0].pushSubscription.subscribe(this.onNewValueCome.bind(this))
    this.inputs[1].pushSubscription.subscribe(this.onInitialAccSet.bind(this))
  }

  onNewValueCome({value}: Subscription<number>) {
    this.outputs[0].push(value)
    this.outputs[1].push(this.endBlock.pull())
    this.endBlock.outputs[0].push(this.outputs[1].pushSubscription.value)
  }

  onInitialAccSet() {
    this.outputs[1].push(this.inputs[1].pushSubscription.value)
  }
}

export class End extends EndBlock<number> {
  static blockName = 'END State'
  static beginBlockClass = Begin

  inputs: [Input<number>] = [new Input<number>('new state', 0, this)]
  outputs: [Output<number>] = [new Output<number>('new state', 0)]

  pull() {
    return this.inputs[0].pull()
  }
}
