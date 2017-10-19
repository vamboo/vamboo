import Point from '../lib/Point'
import {default as BaseBlock, BlockClass} from '../lib/blocks/BaseBlock'
import SliderBlock from '../lib/blocks/SliderBlock'
import LabelBlock from '../lib/blocks/LabelBlock'
import PlusBlock from '../lib/blocks/PlusBlock'
import BaseStore from './BaseStore'


class BlockStore extends BaseStore {
  placedBlocks = new Map<Point, BaseBlock>()
  blockClassToPlace: BlockClass | null = null

  constructor() {
    super()
    this.configure()
  }

  pickBlock(blockClass: BlockClass) {
    this.blockClassToPlace = blockClass
  }

  placeBlock(position: Point) {
    console.assert(this.blockClassToPlace !== null)

    this.placedBlocks = this.placedBlocks.set(position, new this.blockClassToPlace!)
    this.blockClassToPlace = null
  }

  removeBlock(block: BaseBlock) {
    const remaningBlocks: Map<Point, BaseBlock> = new Map

    for (let [key, val] of this.placedBlocks.entries()) {
      if (val === block) continue
      remaningBlocks.set(key, val)
    }

    this.placedBlocks = remaningBlocks
  }

  clear() {
    this.placedBlocks = new Map
  }
}

export default new BlockStore
