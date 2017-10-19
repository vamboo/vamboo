import Point from '../lib/Point'
import BaseBlock from '../lib/blocks/BaseBlock'
import SliderBlock from '../lib/blocks/SliderBlock'
import LabelBlock from '../lib/blocks/LabelBlock'
import PlusBlock from '../lib/blocks/PlusBlock'
import BaseStore from './BaseStore'


class BlockStore extends BaseStore {
  blocks = new Map<Point, BaseBlock>([
    [new Point(40, 100), new SliderBlock],
    [new Point(40, 300), new SliderBlock],
    [new Point(400, 100), new PlusBlock],
    [new Point(800, 100), new LabelBlock]
  ])

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

  clear() {
    this.blocks = new Map
  }
}

export default new BlockStore
