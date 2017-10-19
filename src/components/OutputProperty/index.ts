import * as React from 'react'
import * as h from 'react-hyperscript'
import Output from '../../lib/Output'
import Point from '../../lib/Point'
import arrowStore from '../../stores/ArrowStore'
import * as canvasStyle from '../Canvas/style.styl'


interface PropTypes {
  output: Output<any>
}

export default class extends React.Component<PropTypes> {
  render() {
    return h('li', {onClick: this.onClick.bind(this)}, this.props.output.name!)
  }

  onClick(event: MouseEvent) {
    const canvas = document.getElementsByClassName(canvasStyle.component)[0]
    const clickedX = canvas.scrollLeft + event.clientX
    const clickedY = canvas.scrollTop + event.clientY

    arrowStore.start(new Point(clickedX, clickedY), this.props.output)
  }
}
