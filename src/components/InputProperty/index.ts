import * as React from 'react'
import * as h from 'react-hyperscript'
import Input from '../../lib/Input'
import Output from '../../lib/Output'
import Point from '../../lib/Point'
import Subscription from '../../lib/Subscription'
import arrowStore from '../../stores/ArrowStore'
import * as canvasStyle from '../Canvas/style.styl'


interface PropTypes {
  input: Input<any>
}

interface StateTypes {
  isEditable: boolean
  value: any
}

export default class extends React.Component<PropTypes, StateTypes> {
  rerender = () => this.forceUpdate()

  constructor(props: PropTypes) {
    super(props)
    this.state = {
      isEditable: props.input.connectionSubscription.value === null,
      value: this.props.input.initialValue
    }
  }

  componentDidMount() {
    this.props.input.connectionSubscription.subscribe(this.updateConnection)
    this.props.input.pushSubscription.subscribe(this.updateValue)
    this.props.input.pullSubscription.subscribe(this.updateValue)
  }

  componentWillUnmount() {
    this.props.input.connectionSubscription.unsubscribe(this.updateConnection)
    this.props.input.pushSubscription.unsubscribe(this.updateValue)
    this.props.input.pullSubscription.unsubscribe(this.updateValue)
  }

  render() {
    return h('li', {'data-input-id': this.props.input.id}, [
      h('label', [
        h('div', {onClick: this.onClick.bind(this)}, this.props.input.name),
        h('input', {
          type: 'text',
          value: this.state.value === null ? '' : this.state.value,
          disabled: this.props.input.connectionSubscription.value !== null
            && this.props.input.connectionSubscription.value.name !== null,
          onChange: this.onTextBoxChange.bind(this),
          onBlur: this.onTextBoxBlur.bind(this)
        })
      ])
    ])
  }

  onTextBoxChange(event: Event) {
    this.setState({
      value: (event.target as any).value
    })
  }

  onTextBoxBlur(event: Event) {
    const currentTextBoxValue = parseInt((event.target as any).value, 10)  // TODO: Support non-number input
    if (isNaN(currentTextBoxValue)) return
    this.props.input.connect(new Output(null, currentTextBoxValue))
  }

  onClick(event: MouseEvent) {
    if (arrowStore.startsFrom === null) {
      arrowStore.disconnect(this.props.input)
    } else {
      arrowStore.finish(this.props.input)
    }
  }

  updateValue = ({value}: Subscription<any>) => {
    this.setState({value})
  }

  updateConnection = () => {
    this.setState({
      value: this.props.input.output.pushSubscription.value
    })
  }
}
