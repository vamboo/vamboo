import {FunctionBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class SubtractBlock extends FunctionBlock {
  static blockName = '-'

  inputs: Input<number>[] = [new Input<number>('値1', this), new Input<number>('値2', this)]
  outputs: Output<number>[] = [new Output<number>('結果', 0)]

  constructor() {
    super()

    this.configure()
  }

  onInputUpdate() {
    this.outputs[0].value = this.inputs[0].value! - this.inputs[1].value!
  }
}
