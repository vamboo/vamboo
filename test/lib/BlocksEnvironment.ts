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
