import * as ReactDOM from 'react-dom'
import * as h from 'react-hyperscript'
import UnderConstruction from './components/UnderConstruction'
import BlockList from './components/BlockList/BlockTabs'

ReactDOM.render(
  h(BlockList),
  document.querySelector('body > *')
)
