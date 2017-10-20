import * as _ from 'lodash'
import Subscription from './Subscription'
import Subscriber from './Subscriber'
import Output from './Output'
import BaseBlock from './blocks/BaseBlock'


export default class Input<T> {
  readonly id = _.uniqueId(this.constructor.name)
  connectionSubscription: Subscription<Output<T>>
  valueSubscription: Subscription<T>
  // プログラムを組み立て、シリアライズし、それを走らせる、
  // という分離をちゃんとやっていればこんな複雑なSubscription同士の結びつきは起こらなかった...

  constructor(public name: string, private initialValue: T, public block: BaseBlock) {
    this.connectionSubscription = new Subscription(new Output(null, initialValue))
    this.valueSubscription = new Subscription(initialValue)
  }

  connect(output: Output<T>) {
    this.output.valueSubscription.unsubscribe(this.updateValue)
    output.input = this
    output.valueSubscription.subscribe(this.updateValue)
    this.connectionSubscription.value = output
  }

  disconnect() {
    if (this.isConnected()) {
      this.output.input = null
      this.output.valueSubscription.unsubscribe(this.updateValue)
      this.connectionSubscription.value = new Output(null, this.initialValue)
    }
  }

  isConnected() {
    return this.output.name !== null
  }

  pull(): T {
    return this.output.pull()
  }

  get value(): T {
    return this.output.value
  }

  get output(): Output<T> {
    return this.connectionSubscription.value
  }

  private updateValue = (outputValueSubscription: Subscription<T>) => {
    this.valueSubscription.value = outputValueSubscription.value
  }
}
