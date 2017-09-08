import test from 'ava'
import {FunctionBlock, GUIElementBlock, SourceBlock, SinkBlock} from '../../src/lib/blocks/BaseBlock'
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

test('filter by block kind', t => {
  const blocksEnvironment = new BlocksEnvironment

  @blocksEnvironment.register
  class StubFunctionBlock extends FunctionBlock {
    static blockName = 'Stub function'

    inputs = []
    outputs = []

    onInputUpdate() {
      throw 'not implemented'
    }
  }

  @blocksEnvironment.register
  class StubGUIElementBlock extends GUIElementBlock {
    static blockName = 'Stub GUI Element'

    inputs = []
    outputs = []

    onInputUpdate() {
      throw 'not implemented'
    }
  }

  @blocksEnvironment.register
  class StubSourceBlock extends SourceBlock {
    static blockName = 'Stub source'

    inputs = []
    outputs = []

    onInputUpdate() {
      throw 'not implemented'
    }
  }

  @blocksEnvironment.register
  class StubSinkBlock extends SinkBlock {
    static blockName = 'Stub sink'

    inputs = []
    outputs = []

    onInputUpdate() {
      throw 'not implemented'
    }
  }

  t.deepEqual(blocksEnvironment.getBlocks(FunctionBlock), [StubFunctionBlock])
  t.deepEqual(blocksEnvironment.getBlocks(GUIElementBlock), [StubGUIElementBlock])
  t.deepEqual(blocksEnvironment.getBlocks(SourceBlock), [StubSourceBlock])
  t.deepEqual(blocksEnvironment.getBlocks(SinkBlock), [StubSinkBlock])
})
