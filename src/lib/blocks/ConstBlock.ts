import {FunctionBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class extends FunctionBlock {
  static blockName = '固定'

  inputs: Input<number>[] = [new Input<number>('A', this), new Input<number>('B', this)]
  outputs: Output<number>[] = [new Output<number>('B', 0)]

  constructor() {
    super()

    this.configure()
  }

  onInputUpdate() {
    if (this.inputs[1].value !== null) {
      this.outputs[0].value = this.inputs[1].value!
    }
  }
}
