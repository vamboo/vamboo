import * as _ from 'lodash'
import Subscription from './Subscription'
import Subscriber from './Subscriber'
import Output from './Output'
import BaseBlock from './blocks/BaseBlock'


export default class Input<T> {
  readonly id = _.uniqueId(this.constructor.name)
  connectionSubscription: Subscription<Output<T>>
  pushSubscription: Subscription<T>
  pullSubscription: Subscription<T>
  // プログラムを組み立て、シリアライズし、それを走らせる、
  // という分離をちゃんとやっていればこんな複雑なSubscription同士の結びつきは起こらなかった...

  constructor(public name: string, public initialValue: T, public block: BaseBlock) {
    this.connectionSubscription = new Subscription(new Output(null, initialValue))
    this.pushSubscription = new Subscription(initialValue)
    this.pullSubscription = new Subscription(initialValue)
  }

  connect(output: Output<T>) {
    this.output.pushSubscription.unsubscribe(this.updatePushedValue)
    this.output.pullSubscription.unsubscribe(this.updatePulledValue)
    output.pushSubscription.subscribe(this.updatePushedValue)
    output.pullSubscription.subscribe(this.updatePulledValue)

    this.connectionSubscription.value = output
    output.input = this

    this.pushSubscription.value = output.pushSubscription.value
  }

  disconnect() {
    if (this.isConnected()) {
      this.output.pushSubscription.unsubscribe(this.updatePushedValue)
      this.output.pullSubscription.unsubscribe(this.updatePulledValue)

      this.connectionSubscription.value = new Output(null, this.initialValue)
      this.output.input = null
    }
  }

  isConnected() {
    return this.output.name !== null
  }

  pull(): T {
    return this.output.pull()
  }

  get output(): Output<T> {
    return this.connectionSubscription.value
  }

  private updatePushedValue = ({value}: Subscription<T>) => {
    this.pushSubscription.value = value
  }

  private updatePulledValue = ({value}: Subscription<T>) => {
    this.pullSubscription.value = value
  }
}
