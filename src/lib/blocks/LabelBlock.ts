import {GUIElementBlock} from './BaseBlock'
import Input from '../Input'
import Output from '../Output'
import Label from '../../components/Label'


export default class extends GUIElementBlock {
  static blockName = 'Label'
  static drawer = Label

  inputs: Input<any>[] = [new Input('value', '', this)]
  outputs = []
}
