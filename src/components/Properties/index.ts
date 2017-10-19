import * as React from 'react'
import * as h from 'react-hyperscript'
import BaseBlock from '../../lib/blocks/BaseBlock'
import blockStore from '../../stores/BlockStore'
import InputProperties from '../InputProperties'
import OutputProperties from '../OutputProperties'
import * as s from './style.styl'


interface PropTypes {
  block: BaseBlock
}

export default class extends React.Component<PropTypes> {
  render() {
    return h('div', {className: s.component}, [
      h('header', [
        h('h2', (this.props.block.constructor as typeof BaseBlock).blockName),
        h('a', {onClick: this.onTrashClick.bind(this)}, '🗑')
      ]),
      h('div', [
        h(InputProperties, {inputs: this.props.block.inputs}),
        h(OutputProperties, {outputs: this.props.block.outputs})
      ])
    ])
  }

  onTrashClick() {
    blockStore.removeBlock(this.props.block)
  }
}
