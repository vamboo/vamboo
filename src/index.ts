import * as ReactDOM from 'react-dom'
import * as h from 'react-hyperscript'
import MainComponent from './components/MainComponent'

ReactDOM.render(
  h(MainComponent),
  document.querySelector('body > *')
)
