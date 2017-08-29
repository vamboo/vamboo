import * as React from 'react'
import * as h from 'react-hyperscript'
import PlusBlockComponent from './FunctionBlockComponents/PlusBlockComponent'
import MultiplyBlockComponent from './FunctionBlockComponents/MultiplyBlockComponent'
import LoggingBlockComponent from './FunctionBlockComponents/LoggingBlockComponent'

export default class FunctionBlockList extends React.Component {
    render() {
        return(
            h('ul', [
                h('li',[
                    h(PlusBlockComponent)
                ]),
                h('li', [
                    h(MultiplyBlockComponent)
                ]),
                h('li', [
                    h(LoggingBlockComponent)
                ])
            ])
        )
    }
}
