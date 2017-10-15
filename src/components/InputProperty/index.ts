import * as React from 'react'
import * as h from 'react-hyperscript'
import Input from '../../lib/Input'
import Output from '../../lib/Output'
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
        h('input', {type: 'text', onChange: this.onTextBoxChange.bind(this)})
      ])
    ])
  }

  onConnectionChange() {
    this.setState({
      isEditable:
        this.props.input.connectionObservable.value === null
        || this.props.input.connectionObservable.value.name === null
    })
  }

  onTextBoxChange(event: Event) {
    const currentTextBoxValue = parseInt((event.target as any).value, 10)
    // Input<T>のTに対してfromStringみたいなのが定義されていれば良いんだろうけど、
    // そんな型クラスみたいな仕組みを導入するのが面倒なので、一旦数字前提で進めます
    this.props.input.connect(new Output(null, currentTextBoxValue))
    // valueが変わらない無名Outputを作ってそこにInputを繋げることで定数Inputを実現する
    // Outputのコンストラクタがその名前を引数として取るようにしたのは失敗だったかな...
  }
}
