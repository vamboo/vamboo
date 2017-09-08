import BaseBlock from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class DebugBlock extends BaseBlock {
  static blockName = 'Debug'

  inputs: Input<never>[] = []
  outputs: Output<number>[] = [new Output<number>('output1', 0)]

  onInputUpdate() {
    throw 'not implemented'
  }
}
