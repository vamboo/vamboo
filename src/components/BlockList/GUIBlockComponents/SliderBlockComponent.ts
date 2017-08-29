import * as React from 'react'
import * as h from 'react-hyperscript'

export default class SliderBlockComponent extends React.Component {
    render() {
        return (
            h('input', {type: 'range'})
        )
    }
}
