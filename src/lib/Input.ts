import * as _ from 'lodash'
import Subscription from './Subscription'
import Subscriber from './Subscriber'
import Output from './Output'
import BaseBlock from './blocks/BaseBlock'


export default class Input<T> {
  instanceId = _.uniqueId(this.constructor.name)
  connectionSubscription: Subscription<Output<T> | null> = new Subscription(null)
  valueSubscription: Subscription<T | null> = new Subscription(null)
  // プログラムを組み立て、シリアライズし、それを走らせる、
  // という分離をちゃんとやっていればこんな複雑なSubscription同士の結びつきは起こらなかった...

  constructor(public name: string, public block: BaseBlock) {}

  connect(newOutput: Output<T>) {
    if (this.output !== null) {
      this.output.valueSubscription.unsubscribe(this.updateValue)
    }

    this.output = newOutput
    this.output.valueSubscription.subscribe(this.updateValue)
  }

  get value(): T | null {
    if (this.output === null) return null  // When this Input is not connected to any Output

    return this.output.value
  }

  disconnect() {
    if (this.output !== null) {
      this.output.valueSubscription.unsubscribe(this.updateValue)
    }

    this.output = null
  }

  private get output(): Output<T> | null {
    return this.connectionSubscription.value
  }

  private set output(output: Output<T> | null) {
    this.connectionSubscription.value = output
  }

  private updateValue = (outputValueSubscription: Subscription<T>) => {
    this.valueSubscription.value = outputValueSubscription.value
  }
}
