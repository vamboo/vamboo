import {PushPullFunctionBlock} from './BaseBlock'
import Input from '../Input'
import {LazyOutput} from '../Output'


export default class PlusBlock extends PushPullFunctionBlock<number> {
  static blockName = '+'

  inputs: Input<number>[] = [new Input<number>('値1', 0, this), new Input<number>('値2', 0, this)]
  outputs: [LazyOutput<number>] = [new LazyOutput('結果', 0, this)]

  constructor() {
    super()
    this.configure()
  }

  pull(): number {
    return this.inputs[0].pull() + this.inputs[1].pull()
  }
}
