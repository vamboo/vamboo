import * as React from 'react'
import * as h from 'react-hyperscript'
import SliderBlock from '../../lib/blocks/SliderBlock'


interface PropTypes {
  block: SliderBlock
}

export default class extends React.Component<PropTypes> {
  render() {
    return h('input', {type: 'range', min: 1, max: 100, onChange: this.onChange.bind(this)})
  }

  onChange(event: Event) {
    this.props.block.outputs[0].push(parseInt((event.target as any).value, 10))
  }
}
