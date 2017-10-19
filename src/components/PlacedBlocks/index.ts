import * as React from 'react'
import * as h from 'react-hyperscript'
import Point from '../../lib/Point'
import blockStore from '../../stores/BlockStore'
import PlacedBlock from '../PlacedBlock'
import * as s from './style.styl'


export default class extends React.Component {
  rerender = () => this.forceUpdate()

  componentDidMount() {
    blockStore.subscribe(this.rerender)
  }

  componentWillUnmount() {
    blockStore.unsubscribe(this.rerender)
  }

  render() {
    return h('div', {className: s.component}, Array.from(blockStore.placedBlocks).map(
      ([pos, block]) => h('div', {style: {left: pos.x, top: pos.y}}, [
        h(PlacedBlock, {block})
      ])
    ))
  }
}
