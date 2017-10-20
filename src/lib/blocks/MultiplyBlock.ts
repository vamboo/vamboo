import {PushPullFunctionBlock} from './BaseBlock'
import Input from '../Input'
import {LazyOutput} from '../Output'


export default class MultiplyBlock extends PushPullFunctionBlock<number> {
  static blockName = '*'

  inputs: Input<number>[] = [new Input<number>('operand1', 1, this), new Input<number>('operand2', 0, this)]
  outputs: [LazyOutput<number>] = [new LazyOutput('結果', 1, this)]

  pull() {
    return this.inputs[0].pull() * this.inputs[1].pull()
  }
}
