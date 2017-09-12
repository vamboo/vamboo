import * as React from 'react'
import * as h from 'react-hyperscript'
import SliderBlockElement from './GUIBlockElements/SliderBlockElement'
import LabelBlockElement from "./GUIBlockElements/LabelBlockElement";

export default class GUIBlockList extends React.Component {
    render() {
        return(
            h('ul',[
                h('li',[
                    h(LabelBlockElement)
                ]),
                h('li',[
                    h(SliderBlockElement)
                ])
            ])
        )
    }
}
