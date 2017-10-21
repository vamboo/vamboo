import {GUIElementBlock} from './BaseBlock'
import Output from '../Output'
import Slider from '../../components/Slider'


export default class extends GUIElementBlock {
  static blockName = 'スライダー'
  static drawer = Slider

  inputs = []
  outputs = [new Output('結果', 50)]
}
