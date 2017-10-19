import * as React from 'react'
import * as h from 'react-hyperscript'
import Canvas from '../Canvas'
import BlockList from '../BlockList'
import * as s from './style.styl'


export default class extends React.Component {
  render() {
    return h('div', {className: s.component}, [
      h(Canvas),
      h(BlockList)
    ])
  }
}
