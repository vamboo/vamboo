import {PushPullFunctionBlock} from './BaseBlock'
import Input from '../Input'
import {LazyOutput} from '../Output'


export default class extends PushPullFunctionBlock<number> {
  static blockName = 'Const'

  inputs: Input<number>[] = [new Input<number>('A', 0, this), new Input<number>('B', 0, this)]
  outputs: [LazyOutput<number>] = [new LazyOutput<number>('B', 0, this)]

  constructor() {
    super()

    this.configure()
  }

  pull() {
    return this.inputs[1].pushSubscription.value
  }
}
