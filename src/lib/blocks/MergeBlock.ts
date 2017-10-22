import {PushFunctionBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class extends PushFunctionBlock {
  static blockName = 'Merge'

  inputs: Input<number>[] = [new Input<number>('stream1', 0, this), new Input<number>('stream2', 0, this)]
  outputs: Output<number>[] = [new Output<number>('stream', 0)]

  constructor() {
    super()

    this.inputs.forEach(input => {
      input.pushSubscription.subscribe(() => {
        this.outputs[0].push(input.pushSubscription.value!)
      })
    })
  }
}
