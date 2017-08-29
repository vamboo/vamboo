import * as React from 'react'
import * as h from 'react-hyperscript'
import BlockList from './BlockList/BlockTabs'

export default class MainComponent extends React.Component {
    render() {
        return (
            h(BlockList)
        )
    }
}
