import BaseBlock from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class LoggingBlock extends BaseBlock {
  inputs: Input<number>[] = [new Input<number>('input1', this)]
  outputs: Output<never>[] = []

  onInputUpdate() {
    console.log('input updated:', this.inputs[0].value)
  }
}
