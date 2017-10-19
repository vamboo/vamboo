import {FunctionBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class extends FunctionBlock {
  static blockName = 'マージ'

  inputs: Input<number>[] = [new Input<number>('ストリーム1', this), new Input<number>('ストリーム2', this)]
  outputs: Output<number>[] = [new Output<number>('結果', 0)]

  constructor() {
    super()

    this.configure()
    this.inputs.forEach(input => {
      input.valueSubscription.subscribe(() => {
        this.outputs[0].value = input.value!
      })
    })
  }
}
