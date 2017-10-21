import * as React from 'react'
import * as h from 'react-hyperscript'
import BaseBlock from '../../lib/blocks/BaseBlock'
import blockStore from '../../stores/BlockStore'
import uiVisibilityStore from '../../stores/UIVisibilityStore'
import InputProperties from '../InputProperties'
import OutputProperties from '../OutputProperties'
import * as s from './style.styl'


interface PropTypes {
  block: BaseBlock
}

export default class extends React.Component<PropTypes> {
  rerender = () => this.forceUpdate()

  componentDidMount() {
    uiVisibilityStore.subscribe(this.rerender)
  }

  componentWillUnmount() {
    uiVisibilityStore.unsubscribe(this.rerender)
  }

  render() {
    return h('div', {className: `${s.component} ${uiVisibilityStore.isVisible ? '' : s.hidden}`}, [
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
