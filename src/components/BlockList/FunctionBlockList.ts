import * as React from 'react'
import * as h from 'react-hyperscript'

//TODO: BlockEnvironmentからブロック一覧を取る

export default class FunctionBlockList extends React.Component {
  render() {
    return h('ul', [
      h('li', [h('p', 'Plus')]),
      h('li', [h('p', 'Mlutiply')]),
      h('li', [h('p', 'Logging')])
    ])
  }
}
