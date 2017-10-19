import {SourceBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class DebugBlock extends SourceBlock {
  static blockName = 'Debug'

  outputs: Output<number>[] = [new Output<number>('output1', 0)]
}
