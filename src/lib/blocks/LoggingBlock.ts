import BaseBlock from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class LoggingBlock extends BaseBlock {
  constructor() {
    super()
    this.inputs = [new Input<number>('input1', this)]
    this.outputs = []
  }

  onInputUpdate() {
    console.log(this.inputs[0].value)
  }
}
