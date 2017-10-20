import {SinkBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class LoggingBlock extends SinkBlock {
  static blockName = 'Logging'

  inputs: Input<string>[] = [new Input<string>('input1', '', this)]

  constructor() {
    super()

    this.inputs[0].pushSubscription.subscribe(this.onInputUpdate.bind(this))
  }

  onInputUpdate() {
    console.log('input updated:', this.inputs[0].pushSubscription.value)
  }
}
