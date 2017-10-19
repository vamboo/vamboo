import Point from '../lib/Point'
import {default as BaseBlock, BlockClass, BlockKinds, BeginBlock} from '../lib/blocks/BaseBlock'
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

    if (this.blockClassToPlace!.blockKind === BlockKinds.End) {
      const endBlock = new this.blockClassToPlace!
      this.placedBlocks.set(new Point(position.x + 1000, position.y), endBlock)

      const beginBlock = new (this.blockClassToPlace! as any).beginBlockClass
      beginBlock.connect(endBlock)
      this.placedBlocks.set(new Point(position.x, position.y), beginBlock)
    } else {
      this.placedBlocks.set(position, new this.blockClassToPlace!)
    }

    this.blockClassToPlace = null
  }

  removeBlock(block: BaseBlock) {
    block.inputs.forEach(input => {
      input.disconnect()
    })
    block.outputs.forEach(output => {
      output.disconnect()
    })

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
