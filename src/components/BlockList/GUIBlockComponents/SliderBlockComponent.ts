import * as React from 'react'
import * as h from 'react-hyperscript'
import GUIBlock from '../../../lib/blocks/BaseBlock'

export default class SliderBlockComponent extends React.Component {
    constructor(props) {
        super()
    }
    render() {
        return (
            h('input', {type: 'range'})
        )
    }
}