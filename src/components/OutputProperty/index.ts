import * as React from 'react'
import * as h from 'react-hyperscript'
import Output from '../../lib/Output'
import Point from '../../lib/Point'
import arrowStore from '../../stores/ArrowStore'


interface PropTypes {
  output: Output<any>
}

export default class extends React.Component<PropTypes> {
  render() {
    return h('li', {onClick: this.onClick.bind(this)}, this.props.output.name!)
  }

  onClick(event: MouseEvent) {
    arrowStore.start(new Point(event.clientX, event.clientY), this.props.output)
  }
}
