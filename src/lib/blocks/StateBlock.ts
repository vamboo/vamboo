import {BeginBlock, EndBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export class Begin extends BeginBlock {
  static blockName = 'BEGIN 状態管理'

  inputs: Input<number>[] = [new Input<number>('ストリーム', this), new Input<number>('初期状態', this)]  // TODO: initialAcc
  outputs: Output<number>[] = [new Output<number>('新しい値', 0), new Output<number>('古い状態', 0)]

  constructor() {
    super()

    this.configure()

    this.inputs[0].valueSubscription.subscribe(this.onNewValueCome.bind(this))
  }

  onNewValueCome() {
    this.outputs[1].valueSubscription._value = this.endBlock.outputs[0].value
    this.outputs[0].value = this.inputs[0].value!
  }
}

export class End extends EndBlock {
  static blockName = 'END 状態管理'
  static beginBlockClass = Begin

  inputs: Input<number>[] = [new Input<number>('新しい状態', this)]
  outputs = [new Output<number>('新しい状態', 0)]

  constructor() {
    super()

    this.configure()
  }

  onInputUpdate() {
    this.outputs[0].value = this.inputs[0].value!
  }
}
