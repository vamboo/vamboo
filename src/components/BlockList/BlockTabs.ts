import * as React from 'react'
import * as h from 'react-hyperscript'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import GUIBlockList from './GUIBlockList'
import FunctionBlockList from './FunctionBlockList'
import * as s from './tab.styl'

export default class BlockTabs extends React.Component {
  render() {
    return h(Tabs, { className: s.tabs }, [
      h(TabList, { className: s.tabList }, [
        h(Tab, { className: s.tab }, 'GUI'),
        h(Tab, { className: s.tab }, 'Function')
      ]),
      h(TabPanel, { className: s.tabPanel }, [h(GUIBlockList)]),
      h(TabPanel, { className: s.tabPanel }, [h(FunctionBlockList)])
    ])
  }
}
