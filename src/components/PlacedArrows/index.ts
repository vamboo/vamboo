import * as React from 'react'
import * as h from 'react-hyperscript'
import * as _ from 'lodash'
import BaseBlock from '../../lib/blocks/BaseBlock'
import arrowStore from '../../stores/ArrowStore'
import blockStore from '../../stores/BlockStore'
import * as canvasStyle from '../Canvas/style.styl'


export default class extends React.Component {
  rerender = () => this.forceUpdate()

  componentDidMount() {  // TODO: 毎回書くのは面倒なのでStoreBindedComponentみたいな基底クラス作る
    arrowStore.subscribe(this.rerender)
  }

  componentWillUnmount() {
    arrowStore.unsubscribe(this.rerender)
  }

  render() {
    return h('g', _(Array.from(blockStore.placedBlocks.values())).flatMap(
      (block: BaseBlock) => _(block.inputs).flatMap(input => {
        if (input.connectionSubscription.value === null || input.connectionSubscription.value.name === null) return []

        const canvas = document.getElementsByClassName(canvasStyle.component)[0]
        const inputPropertyBox =
          document
          .querySelectorAll(`[data-input-id=${input.id}]`)[0]
          .getBoundingClientRect()
        const outputPropertyBox =
          document
          .querySelectorAll(`[data-output-id=${input.connectionSubscription.value.id}]`)[0]
          .getBoundingClientRect()
        return [
          h('line', {
            x1: canvas.scrollLeft + outputPropertyBox.left + outputPropertyBox.width,
            y1: canvas.scrollTop + outputPropertyBox.top + (outputPropertyBox.height / 2),
            x2: canvas.scrollLeft + inputPropertyBox.left,
            y2: canvas.scrollTop + inputPropertyBox.top + (inputPropertyBox.height / 2)
          })
        ]
      }).value()
    ).value())
  }
}
