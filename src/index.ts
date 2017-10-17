import * as ReactDOM from 'react-dom'
import * as h from 'react-hyperscript'
import App from './components/App'

ReactDOM.render(
  h(App),
  document.querySelector('body > *')
)
