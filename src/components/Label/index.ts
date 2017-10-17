import * as React from 'react'
import * as h from 'react-hyperscript'
import LabelBlock from '../../lib/blocks/LabelBlock'


interface PropTypes {
  block: LabelBlock
}

export default class extends React.Component<PropTypes> {
  rerender = () => this.forceUpdate()

  componentDidMount() {
    this.props.block.inputs.forEach(input => {
      input.valueSubscription.subscribe(this.rerender)
    })
  }

  componentWillUnmount() {
    this.props.block.inputs.forEach(input => {
      input.valueSubscription.unsubscribe(this.rerender)
    })
  }

  render() {
    return h('div', this.props.block.inputs[0].value)
  }
}
