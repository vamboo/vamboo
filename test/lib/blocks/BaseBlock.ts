import test from 'ava'
import * as sinon from 'sinon'
import BaseBlock from '../../../src/lib/blocks/BaseBlock'
import Input from '../../../src/lib/Input'
import Output from '../../../src/lib/Output'


class PlusOneBlock extends BaseBlock {
  static blockName = '+1'

  constructor() {
    super()
    this.inputs = [new Input<number>('input1', this)]
    this.outputs = [new Output<number>('output1', 0)]
  }

  update() {
    this.outputs[0].observable.update(this.inputs[0].output!.observable.value + 1)
  }
}

test('chain of update', t => {
  const block1 = new PlusOneBlock
  const block2 = new PlusOneBlock
  block2.outputs[0].observable.update = sinon.spy()

  block2.inputs[0].connect(block1.outputs[0])
  block1.outputs[0].observable.update(9)

  t.is((block2.outputs[0].observable.update as any).getCall(0).args[0], 1)
  t.is((block2.outputs[0].observable.update as any).getCall(1).args[0], 10)
})
