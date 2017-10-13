import BaseBlock from './BaseBlock'
import Input from '../Input'
import Output from '../Output'


export default class DebugBlock extends BaseBlock {
  constructor() {
    super()
    this.inputs = []
    this.outputs = [new Output<number>('output1', 0)]
  }

  onInputUpdate() {
    throw 'not implemented'
  }
}
