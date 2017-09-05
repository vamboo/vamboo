import test from 'ava'
import {FunctionBlock} from '../../src/lib/blocks/BaseBlock'
import BlocksEnvironment from '../../src/lib/BlocksEnvironment'


class StubBlock extends FunctionBlock {
  static blockName = 'Stub'

  inputs = []
  outputs = []

  onInputUpdate() {
    throw 'not implemented'
  }
}

test('register block', t => {
  const blocksEnvironment = new BlocksEnvironment
  blocksEnvironment.register(StubBlock)
  t.deepEqual(blocksEnvironment.getBlocks(), [StubBlock])
})

test('register block using decorator', t => {
  const blocksEnvironment = new BlocksEnvironment

  @blocksEnvironment.register
  class StubBlock2 extends FunctionBlock {
    static blockName = 'Stub2'

    inputs = []
    outputs = []

    onInputUpdate() {
      throw 'not implemented'
    }
  }

  t.deepEqual(blocksEnvironment.getBlocks(), [StubBlock2])
})
