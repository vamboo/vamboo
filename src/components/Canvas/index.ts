import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as h from 'react-hyperscript'
import Point from '../../lib/Point'
import blockStore from '../../stores/BlockStore'
import PlacedBlocks from '../PlacedBlocks'
import Arrows from '../Arrows'
import * as s from './style.styl'


export default class extends React.Component {
  render() {
    return h('div', {className: s.component, onClick: this.onClick.bind(this)}, [
      h(PlacedBlocks),
      h(Arrows)
    ])
  }

  onClick(event: MouseEvent) {
    const canvas = ReactDOM.findDOMNode(this)
    const clickedX = canvas.scrollLeft + event.clientX
    const clickedY = canvas.scrollTop + event.clientY

    if (blockStore.blockClassToPlace !== null) {
      blockStore.placeBlock(new Point(clickedX, clickedY))
    }
  }
}
