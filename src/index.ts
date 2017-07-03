import * as ReactDOM from 'react-dom'
import * as h from 'react-hyperscript'
import * as styles from './index.styl'

ReactDOM.render(
  h('h1', {className: styles.bigger}, 'UNDER CONSTRUCTION'),
  document.querySelector('body > *')
)
