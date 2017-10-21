import * as React from 'react'
import * as h from 'react-hyperscript'
import UIVisibilityButton from '../UIVisibilityButton'
import BlockList from '../BlockList'
import * as s from './style.styl'


export default class extends React.Component {
  render() {
    return h('div', {className: s.component}, [
      h(UIVisibilityButton),
      h(BlockList)
    ])
  }
}
