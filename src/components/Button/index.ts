import * as React from 'react'
import * as h from 'react-hyperscript'
import ButtonBlock from '../../lib/blocks/ButtonBlock'


interface PropTypes {
  block: ButtonBlock
}

export default class extends React.Component<PropTypes> {
  rerender = () => this.forceUpdate()

  render() {
    return h('input', {
      type: 'button',
      value: 'ボタン',  // TODO: fromStringを実装して可変にする
      onClick: this.onClick.bind(this)
    })
  }

  onClick() {
    this.props.block.outputs[0].push((new Date).getTime())  // 仮
  }
}
