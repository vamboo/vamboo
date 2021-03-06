import {GUIElementBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'
import Button from '../../components/Button'


export default class extends GUIElementBlock {
  static blockName = 'Button'
  static drawer = Button

  inputs: Input<any>[] = [new Input<string>('label', '', this)]
  outputs = [new Output('click', 0)]
}
