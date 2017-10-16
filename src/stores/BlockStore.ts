import Point from '../lib/Point'
import BaseBlock from '../lib/blocks/BaseBlock'
import BaseStore from './BaseStore'


class BlockStore extends BaseStore {
  blocks: Map<Point, BaseBlock> = new Map

  constructor() {
    super()
    this.configure()
  }

  placeBlock(point: Point, block: BaseBlock) {
    this.blocks = this.blocks.set(point, block)  // ugly but using setter is required
    // TODO: セッターが呼ばれたときではなくアクションの完了時にBaseStore#notifyする
  }

  removeBlock(block: BaseBlock) {
    const remaningBlocks: Map<Point, BaseBlock> = new Map

    for (let [key, val] of this.blocks.entries()) {
      if (val === block) continue
      remaningBlocks.set(key, val)
    }

    this.blocks = remaningBlocks
  }
}

export default new BlockStore
