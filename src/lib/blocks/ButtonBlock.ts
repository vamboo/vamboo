import {GUIElementBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'
import Button from '../../components/Button'


export default class extends GUIElementBlock {
  static blockName = 'ボタン'
  static drawer = Button

  inputs: Input<any>[] = [new Input<string>('テキスト', this)]
  outputs = [new Output('クリック', 0)]
}
