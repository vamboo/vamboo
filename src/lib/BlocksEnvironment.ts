import * as _ from 'lodash'
import {default as BaseBlock, FunctionBlock, GUIElementBlock, SourceBlock, SinkBlock} from './blocks/BaseBlock'


export default class BlocksEnvironment {
  private blocks: typeof BaseBlock[] = []

  constructor() {
    this.register = this.register.bind(this)  // to use it as decorator
  }

  register(block: typeof BaseBlock) {
    this.blocks.push(block)
  }

  unregister(block: typeof BaseBlock) {
    _.pull(this.blocks, block)
  }

  getBlocks(blockKind?: typeof FunctionBlock | typeof GUIElementBlock | typeof SourceBlock | typeof SinkBlock) {
    if (blockKind === undefined) {
      return this.blocks
    }

    return this.blocks.filter(block => Object.getPrototypeOf(block) === blockKind)
  }
}

export const blocksEnvironment = new BlocksEnvironment
