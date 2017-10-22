import {PushPullFunctionBlock} from './BaseBlock'
import Input from '../Input'
import {LazyOutput} from '../Output'


export default class MultiplyBlock extends PushPullFunctionBlock<number> {
  static blockName = '×'

  inputs: Input<number>[] = [new Input<number>('値1', 1, this), new Input<number>('値2', 1, this)]
  outputs: [LazyOutput<number>] = [new LazyOutput('結果', 1, this)]

  constructor() {
    super()

    this.configure()
  }

  pull() {
    return this.inputs[0].pull() * this.inputs[1].pull()
  }
}
