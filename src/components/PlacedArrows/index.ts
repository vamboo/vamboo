import * as React from 'react'
import * as h from 'react-hyperscript'
import arrowStore from '../../stores/ArrowStore'


export default class extends React.Component {
  constructor() {
    super()

    this.forceUpdate = this.forceUpdate.bind(this)
  }

  componentDidMount() {  // TODO: 毎回書くのは面倒なのでStoreBindedComponentみたいな基底クラス作る
    arrowStore.subscribe(this.forceUpdate)
  }

  componentWillUnmount() {
    arrowStore.unsubscribe(this.forceUpdate)
  }

  render() {
    return h('g', arrowStore.placedArrows.map(
      arrow => h('line', {x1: arrow.start.x, y1: arrow.start.y, x2: arrow.end.x, y2: arrow.end.y})
    ))
  }
}
