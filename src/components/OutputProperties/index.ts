import * as React from 'react'
import * as h from 'react-hyperscript'
import Output from '../../lib/Output'
import OutputProperty from '../OutputProperty'
import * as s from './style.styl'


export default class extends React.Component<{outputs: Output<any>[]}> {
  render() {
    console.log(this.props.outputs)
    return h('div', {className: s.component}, [
      h('h3', 'Output'),
      h('ul', this.props.outputs.map(output =>
        h(OutputProperty, {output})
      ))
    ])
  }
}
