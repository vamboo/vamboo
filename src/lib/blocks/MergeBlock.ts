import {PushFunctionBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class extends PushFunctionBlock {
  static blockName = 'マージ'

  inputs: Input<number>[] = [new Input<number>('ストリーム1', 0, this), new Input<number>('ストリーム2', 0, this)]
  outputs: Output<number>[] = [new Output<number>('結果', 0)]

  constructor() {
    super()

    this.inputs.forEach(input => {
      input.valueSubscription.subscribe(() => {
        this.outputs[0].value = input.value!
      })
    })
  }
}
