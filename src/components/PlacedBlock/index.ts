import * as React from 'react'
import * as h from 'react-hyperscript'
import {default as BaseBlock, GUIElementBlock} from '../../lib/blocks/BaseBlock'
import Properties from '../Properties'
import * as s from './style.styl'


interface PropTypes {
  block: BaseBlock
}

export default class extends React.Component<PropTypes> {
  render() {
    let blockView: React.ReactElement<any>[] = []
    if (this.props.block instanceof GUIElementBlock) {
      blockView = [
        h('div', {className: s.view}, [
          h((this.props.block.constructor as typeof GUIElementBlock).reactComponent, {block: this.props.block})
        ])
      ]
    }

    return h('div', {className: s.component}, [
      ...blockView,
      h('div', {className: s.properties}, [
        h(Properties, {block: this.props.block})
      ])
    ])
  }
}
