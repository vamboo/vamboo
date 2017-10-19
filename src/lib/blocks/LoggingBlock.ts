import {SinkBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class LoggingBlock extends SinkBlock {
  static blockName = 'Logging'

  inputs: Input<number>[] = [new Input<number>('input1', this)]

  constructor() {
    super()

    this.configure()
  }

  onInputUpdate() {
    console.log('input updated:', this.inputs[0].value)
  }
}
