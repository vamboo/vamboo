import * as React from 'react'
import * as h from 'react-hyperscript'
import PlusBlockComponent from './FunctionBlockComponents/PlusBlockComponent'

export default class FunctionBlockList extends React.Component {
    render() {
        return(
            h('ul', [
                h('li',[
                    h(PlusBlockComponent)
                ])
            ])
        )
    }
}