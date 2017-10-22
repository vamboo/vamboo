import {PushPullFunctionBlock} from './BaseBlock'
import Input from '../Input'
import {LazyOutput} from '../Output'


export default class PlusBlock extends PushPullFunctionBlock<number> {
  static blockName = '+'

  inputs: Input<number>[] = [new Input<number>('value1', 0, this), new Input<number>('value2', 0, this)]
  outputs: [LazyOutput<number>] = [new LazyOutput('result', 0, this)]

  constructor() {
    super()
    this.configure()
  }

  pull(): number {
    return this.inputs[0].pull() + this.inputs[1].pull()
  }
}
