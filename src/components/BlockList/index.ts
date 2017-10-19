import * as React from 'react'
import * as h from 'react-hyperscript'
import * as _ from 'lodash'
import {BlockKinds} from '../../lib/blocks/BaseBlock'
import blocksEnvironmentStore from '../../stores/BlocksEnvironmentStore'
import * as s from './style.styl'


interface StateTypes {
  selectedKind: BlockKinds
}

export default class BlockList extends React.Component<{}, StateTypes> {
  rerender = () => this.forceUpdate()
  state = {selectedKind: BlockKinds.GUI}

  componentDidMount() {
    blocksEnvironmentStore.subscribe(this.rerender)
  }

  componentWillUnmount() {
    blocksEnvironmentStore.unsubscribe(this.rerender)
  }

  render() {
    return h('div', {className: s.component}, [
      h('ul', _.range(Object.keys(BlockKinds).length / 2).map(
        blockKindIndex => h('li', [
          h('label', [
            h('input', {
              type: 'radio',
              name: 'blockKindsTab',
              value: blockKindIndex,
              checked: blockKindIndex === this.state.selectedKind,
              onChange: this.onTabClick.bind(this)
            }),
            BlockKinds[blockKindIndex]
          ])
        ])
      )),
      h('ul', blocksEnvironmentStore.getBlockClasses(this.state.selectedKind).map(
        blockClass => h('li', blockClass.blockName)
      ))
    ])
  }

  onTabClick(event: Event) {
    this.setState({
      selectedKind: parseInt((event.target as any).value, 10)
    })
  }
}
