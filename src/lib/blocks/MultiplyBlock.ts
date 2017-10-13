import {FunctionBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class MultiplyBlock extends FunctionBlock {
  static blockName = '*'

  inputs: Input<number>[] = [new Input<number>('operand1', this), new Input<number>('operand2', this)]
  outputs: Output<number>[] = [new Output<number>('output1', 0)]

  onInputUpdate() {
    this.outputs[0].value = this.inputs[0].value * this.inputs[1].value
  }
}
