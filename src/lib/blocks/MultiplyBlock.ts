import {PushPullFunctionBlock} from './BaseBlock'
import Input from '../Input'
import {LazyOutput} from '../Output'


export default class MultiplyBlock extends PushPullFunctionBlock<number> {
  static blockName = 'x'

  inputs: Input<number>[] = [new Input<number>('value1', 1, this), new Input<number>('value2', 1, this)]
  outputs: [LazyOutput<number>] = [new LazyOutput('result', 1, this)]

  constructor() {
    super()

    this.configure()
  }

  pull() {
    return this.inputs[0].pull() * this.inputs[1].pull()
  }
}
