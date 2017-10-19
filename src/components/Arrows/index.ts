import * as React from 'react'
import * as h from 'react-hyperscript'
import * as _ from 'lodash'
import blockStore from '../../stores/BlockStore'
import PlacedArrows from '../PlacedArrows'
import * as canvasStyle from '../Canvas/style.styl'
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
    const canvas = document.getElementsByClassName(canvasStyle.component)[0]

    return h('svg', {className: s.component, width: canvas && canvas.scrollWidth, height: canvas && canvas.scrollHeight}, [
      h(PlacedArrows),
//      TODO: h(FloatingArrow)
    ])
  }
}
