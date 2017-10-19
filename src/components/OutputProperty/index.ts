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
    return h('li', {
      'data-output-id': this.props.output.instanceId,
      onClick: this.onClick.bind(this)
    }, this.props.output.name!)
  }

  onClick() {
    arrowStore.start(this.props.output)
  }
}
