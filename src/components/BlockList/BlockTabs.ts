import * as React from 'react'
import * as h from 'react-hyperscript'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import GUIBlockList from './GUIBlockList'
import FunctionBlockList from './FunctionBlockList'

export default class BlockTabs extends React.Component {
    render() {
        return(
            h(Tabs, [
                h(TabList, [
                    h(Tab, 'GUI'),
                    h(Tab, 'Function')
                ]),
                h(TabPanel, [h(GUIBlockList)]),
                h(TabPanel, [h(FunctionBlockList)])
            ])
        )
    }
}