import {SourceBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'
import {blocksEnvironment} from '../BlocksEnvironment'


@blocksEnvironment.register
export default class DebugBlock extends SourceBlock {
  static blockName = 'Debug'

  outputs: Output<number>[] = [new Output<number>('output1', 0)]
}
