import * as React from 'react'
import * as h from 'react-hyperscript'
import SliderBlockComponent from './GUIBlockComponents/SliderBlockComponent'
import LabelBlockComponent from "./GUIBlockComponents/LabelBlockComponent";

export default class GUIBlockList extends React.Component {
    render() {
        return(
            h('ul',[
                h('li',[
                    h(LabelBlockComponent)
                ]),
                h('li',[
                    h(SliderBlockComponent)
                ])
            ])
        )
    }
}
