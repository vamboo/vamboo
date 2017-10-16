import * as React from 'react'
import * as h from 'react-hyperscript'
import Point from '../../lib/Point'
import blockStore from '../../stores/BlockStore'
import Properties from '../Properties'
import * as s from './style.styl'


export default class extends React.Component {
  constructor() {
    super()
    this.forceUpdate = this.forceUpdate.bind(this)
  }

  componentDidMount() {
    blockStore.subscribe(this.forceUpdate)
  }

  componentWillUnmount() {
    blockStore.unsubscribe(this.forceUpdate)
  }

  render() {
    return h('div', {className: s.component}, Array.from(blockStore.blocks).map(
      ([pos, block]) => h('div', {style: {left: pos.x, top: pos.y}}, [
        h(Properties, {block})  // TODO: PlacedBlockで置き換え
      ])
    ))
  }
}
