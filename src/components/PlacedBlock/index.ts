import * as React from 'react'
import * as h from 'react-hyperscript'
import {default as BaseBlock, GUIElementBlock} from '../../lib/blocks/BaseBlock'
import Properties from '../Properties'


interface PropTypes {
  block: BaseBlock
}

export default class extends React.Component<PropTypes> {
  render() {
    const blockView =
      this.props.block instanceof GUIElementBlock
      ? [h((this.props.block.constructor as typeof GUIElementBlock).reactComponent, {block: this.props.block})]
      : []

    return h('div', blockView.concat([
      h(Properties, {block: this.props.block})
    ]))
  }
}
