import * as React from 'react'
import * as h from 'react-hyperscript'
import Input from '../../lib/Input'
import * as s from './style.styl'


interface PropTypes {
  input: Input<any>
}

export default class extends React.Component<PropTypes, {isEditable: boolean}> {
  constructor(props: PropTypes) {
    super(props)
    this.state = {
      isEditable: props.input.connectionObservable.value === null
    }

    this.onConnectionChange = this.onConnectionChange.bind(this)
  }

  componentDidMount() {
    this.props.input.connectionObservable.addObserver(this.onConnectionChange)
  }

  componentWillUnmount() {
    this.props.input.connectionObservable.removeObserver(this.onConnectionChange)
  }

  render() {
    return h('li', {className: s.component + (this.state.isEditable ? 'editable' : '')}, [
      h('label', [
        this.props.input.name,
        h('input', {type: 'text'})
      ])
    ])
  }

  onConnectionChange() {
    this.setState({
      isEditable: this.props.input.connectionObservable.value === null
    })
  }
}
