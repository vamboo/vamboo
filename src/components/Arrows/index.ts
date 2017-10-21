import * as React from 'react'
import * as h from 'react-hyperscript'
import * as _ from 'lodash'
import blockStore from '../../stores/BlockStore'
import uiVisibilityStore from '../../stores/UIVisibilityStore'
import PlacedArrows from '../PlacedArrows'
import * as canvasStyle from '../Canvas/style.styl'
import * as s from './style.styl'


export default class extends React.Component {
  rerender = () => this.forceUpdate()

  componentDidMount() {
    uiVisibilityStore.subscribe(this.rerender)
    blockStore.subscribe(this.rerender)
  }

  componentWillUnmount() {
    uiVisibilityStore.unsubscribe(this.rerender)
    blockStore.unsubscribe(this.rerender)
  }

  render() {
    const canvas = document.getElementsByClassName(canvasStyle.component)[0]

    return h('svg', {
      className: `${s.component} ${uiVisibilityStore.isVisible ? '' : s.hidden}`,
      width: canvas && canvas.scrollWidth,
      height: canvas && canvas.scrollHeight
    }, [
      h(PlacedArrows),
//      TODO: h(FloatingArrow)
    ])
  }
}
