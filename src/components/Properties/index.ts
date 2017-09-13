import * as React from 'react'
import * as h from 'react-hyperscript'
import BaseBlock from '../../lib/blocks/BaseBlock'
import InputProperties from '../InputProperties'
import OutputProperties from '../OutputProperties'
import * as s from './style.styl'


export default class extends React.Component<{block: BaseBlock}> {
  render() {
    return h('div', {className: s.component}, [
      h('h2', (this.props.block.constructor as typeof BaseBlock).blockName),
      h('div', [
        h(InputProperties, {inputs: this.props.block.inputs}),
        h(OutputProperties, {outputs: this.props.block.outputs})
      ])
    ])
  }
}
