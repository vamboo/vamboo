import * as React from 'react'
import * as h from 'react-hyperscript'
import Input from '../../lib/Input'
import Output from '../../lib/Output'
import Point from '../../lib/Point'
import arrowStore from '../../stores/ArrowStore'
import * as canvasStyle from '../Canvas/style.styl'


interface PropTypes {
  input: Input<any>
}

export default class extends React.Component<PropTypes, {isEditable: boolean}> {
  rerender = () => this.forceUpdate()

  constructor(props: PropTypes) {
    super(props)
    this.state = {
      isEditable: props.input.connectionSubscription.value === null
    }
  }

  componentDidMount() {
    this.props.input.connectionSubscription.subscribe(this.rerender)
    this.props.input.valueSubscription.subscribe(this.rerender)
  }

  componentWillUnmount() {
    this.props.input.connectionSubscription.unsubscribe(this.rerender)
    this.props.input.valueSubscription.unsubscribe(this.rerender)
  }

  render() {
    return h('li', {'data-input-id': this.props.input.instanceId, onClick: this.onClick.bind(this)}, [
      h('label', [
        this.props.input.name,
        h('input', {
          type: 'text',
          value: this.props.input.value === null ? '' : this.props.input.value,
          disabled: this.props.input.connectionSubscription.value !== null
            && this.props.input.connectionSubscription.value.name !== null,
          onChange: this.onTextBoxChange.bind(this)
        })
      ])
    ])
  }

  onTextBoxChange(event: Event) {
    const currentTextBoxValue = parseInt((event.target as any).value, 10)
    // Input<T>のTに対してfromStringみたいなのが定義されていれば良いんだろうけど、
    // そんな型クラスみたいな仕組みを導入するのが面倒なので、一旦数字前提で進めます
    this.props.input.connect(new Output(null, currentTextBoxValue))
    // valueが変わらない無名Outputを作ってそこにInputを繋げることで定数Inputを実現する
    // Outputのコンストラクタがその名前を引数として取るようにしたのは失敗だったかな...
  }

  onClick(event: MouseEvent) {
    // TODO: clientXではなくCanvasのスクロールを考慮した値を使う
    if (arrowStore.floatingArrow === null) return  // TODO: as any が必要なのいつか直したい...

    const canvas = document.getElementsByClassName(canvasStyle.component)[0]
    const clickedX = canvas.scrollLeft + event.clientX
    const clickedY = canvas.scrollTop + event.clientY
    arrowStore.finish(new Point(clickedX, clickedY), this.props.input)
  }
}
