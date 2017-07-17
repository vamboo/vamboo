import * as React from 'react'
import * as h from 'react-hyperscript'
import * as CSSModules from 'react-css-modules'
import * as styles from './style.styl'


@CSSModules(styles)
export default class extends React.Component {
  render() {
    return h('h1', {styleName: 'bigger'}, 'UNDER CONSTRUCTION')
  }
}
