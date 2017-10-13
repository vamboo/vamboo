import * as React from 'react'
import * as h from 'react-hyperscript'
import Input from '../../lib/Input'
import InputProperty from '../InputProperty'
import * as s from './style.styl'


export default class extends React.Component<{inputs: Input<any>[]}> {
  render() {
    return h('div', {className: s.component}, [
      h('h3', 'Input'),
      h('ul', this.props.inputs.map(input => h(InputProperty, {input})))
    ])
  }
}
