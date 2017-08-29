import * as React from 'react'
import * as h from 'react-hyperscript'
import GUIBlock from '../../../lib/blocks/BaseBlock'

export default class SliderBlockComponent extends React.Component {
    render() {
        return (
            h('input', {type: 'range'})
        )
    }
}
