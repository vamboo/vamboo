import * as React from 'react'
import * as h from 'react-hyperscript'
import SliderBlockElement from '../GUIElements/SliderElement'
import LabelBlockElement from '../GUIElements/LabelElement'

export default class GUIBlockList extends React.Component {
  render() {
    return h('ul', [
      h('li', [h(LabelBlockElement)]),
      h('li', [h(SliderBlockElement)])
    ])
  }
}
