import {PushFunctionBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


// TODO: PushPullFunctionBlockにする
export default class extends PushFunctionBlock {
  static blockName = '固定'

  inputs: Input<number>[] = [new Input<number>('A', 0, this), new Input<number>('B', 0, this)]
  outputs: Output<number>[] = [new Output<number>('B', 0)]

  constructor() {
    super()

    this.inputs[0].connectionSubscription.subscribe(this.onInputUpdate.bind(this))
    this.inputs[0].pushSubscription.subscribe(this.onInputUpdate.bind(this))
  }

  onInputUpdate() {
    if (this.inputs[1].pushSubscription.value !== null) {
      this.outputs[0].push(this.inputs[1].pushSubscription.value!)
    }
  }
}
