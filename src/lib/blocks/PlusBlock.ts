import BaseBlock from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class PlusBlock extends BaseBlock {
  constructor() {
    super()
    this.inputs = [new Input<number>('operand1', this), new Input<number>('operand2', this)]
    this.outputs = [new Output<number>('output1', 0)]
  }

  onInputUpdate() {
    this.outputs[0].value = this.inputs[0].value + this.inputs[1].value
  }
}
