import {GUIElementBlock} from './BaseBlock'
import Output from '../Output'
import Slider from '../../components/Slider'


export default class extends GUIElementBlock {
  static blockName = 'Slider'
  static drawer = Slider

  inputs = []
  outputs = [new Output('result', 50)]
}
