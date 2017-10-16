import * as React from 'react'
import * as h from 'react-hyperscript'
import * as _ from 'lodash'
import arrowStore from '../../stores/ArrowStore'
import PlacedArrows from '../PlacedArrows'
// import FloatingArrow from '../FloatingArrow'
import * as s from './style.styl'


export default class extends React.Component {
  constructor() {
    super()

    this.forceUpdate = this.forceUpdate.bind(this)
  }

  componentDidMount() {
    arrowStore.subscribe(this.forceUpdate)
  }

  componentWillUnmount() {
    arrowStore.unsubscribe(this.forceUpdate)
  }

  render() {
    const arrowPoints = _.flatMap(arrowStore.placedArrows, arrow => [arrow.start, arrow.end])
    const mostRightArrow = _.max(arrowPoints.map(point => point.x))
    const mostBottomArrow = _.max(arrowPoints.map(point => point.y))

    return h('svg', {className: s.component, width: mostRightArrow, height: mostBottomArrow}, [
      h(PlacedArrows),
//      TODO: h(FloatingArrow)
    ])
  }
}
