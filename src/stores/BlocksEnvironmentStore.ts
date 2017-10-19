import * as _ from 'lodash'
import BaseStore from './BaseStore'
import {default as BaseBlock, FunctionBlock, GUIElementBlock, SourceBlock, SinkBlock, BlockClass, BlockKinds}
  from '../lib/blocks/BaseBlock'
import SliderBlock from '../lib/blocks/SliderBlock'
import PlusBlock from '../lib/blocks/PlusBlock'
import LabelBlock from '../lib/blocks/LabelBlock'
import SubtractBlock from '../lib/blocks/SubtractBlock'
import * as StateBlock from '../lib/blocks/StateBlock'
import ButtonBlock from '../lib/blocks/ButtonBlock'


class BlocksEnvironmentStore extends BaseStore {
  private blockClasses: BlockClass[] = [SliderBlock, PlusBlock, LabelBlock, SubtractBlock, StateBlock.End, ButtonBlock]

  constructor() {
    super()

    this.configure()
  }

  register(blockClass: BlockClass) {
    this.blockClasses = this.blockClasses.concat([blockClass])
  }

  unregister(blockClass: BlockClass) {
    this.blockClasses = _.difference(this.blockClasses, [blockClass])
  }

  getBlockClasses(blockKind?: BlockKinds) {
    if (blockKind === undefined) {
      return this.blockClasses
    }

    return this.blockClasses.filter(blockClass => blockClass.blockKind === blockKind)
  }
}

export default new BlocksEnvironmentStore
