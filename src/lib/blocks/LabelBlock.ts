import {GUIElementBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'
import Label from '../../components/Label'


export default class extends GUIElementBlock {
  static blockName = 'ラベル'
  static drawer = Label

  inputs: Input<any>[] = [new Input('表示する文字列', this)]
  outputs = []  // TODO: クリックとか
}
