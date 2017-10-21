import * as React from 'react'
import * as h from 'react-hyperscript'
import uiVisibilityStore from '../../stores/UIVisibilityStore'


export default class extends React.Component {
  rerender = () => this.forceUpdate()

  componentDidMount() {
    uiVisibilityStore.subscribe(this.rerender)
  }

  componentWillUnmonut() {
    uiVisibilityStore.unsubscribe(this.rerender)
  }

  render() {
    return h('a', {onClick: this.onClick.bind(this)}, uiVisibilityStore.isVisible ? 'Hide UI' : 'Show UI')
  }

  onClick() {
    uiVisibilityStore.toggle()
  }
}
