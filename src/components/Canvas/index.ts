import * as React from 'react'
import * as h from 'react-hyperscript'
import PlacedBlocks from '../PlacedBlocks'
import Arrows from '../Arrows'
import * as s from './style.styl'


// TODO: Make this scrollable
export default class extends React.Component {
  render() {
    return h('div', {className: s.component}, [
      h(PlacedBlocks),
      h(Arrows)
    ])
  }
}
