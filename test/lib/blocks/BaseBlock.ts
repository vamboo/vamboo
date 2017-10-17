import test from 'ava'
import * as sinon from 'sinon'
import {FunctionBlock} from '../../../src/lib/blocks/BaseBlock'
import Input from '../../../src/lib/Input'
import Output from '../../../src/lib/Output'


class PlusOneBlock extends FunctionBlock {
  static blockName = '+1'

  inputs: Input<number>[] = [new Input<number>('input1', this)]
  outputs: Output<number>[] = [new Output<number>('output1', 0)]

  constructor() {
    super()

    this.configure()
  }

  onInputUpdate() {
    this.outputs[0].value = this.inputs[0].value! + 1
  }
}

test('chain of update', t => {
  const block1 = new PlusOneBlock
  const block2 = new PlusOneBlock

  block2.inputs[0].connect(block1.outputs[0])
  block1.outputs[0].value = 9

  t.is(block2.outputs[0].value, 10)
})
