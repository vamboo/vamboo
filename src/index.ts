import * as ReactDOM from 'react-dom'
import * as h from 'react-hyperscript'
import App from './components/App'
import 'normalize.css'
import './style.styl'


ReactDOM.render(
  h(App),
  document.querySelector('body > *')
)
