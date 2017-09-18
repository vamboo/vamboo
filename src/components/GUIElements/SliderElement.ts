import * as React from 'react'
import * as h from 'react-hyperscript'

export default class SliderBlockElement extends React.Component {
  render() {
    return h('input', { type: 'range' })
  }
}
