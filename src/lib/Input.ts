import Subscription from './Subscription'
import Subscriber from './Subscriber'
import Output from './Output'
import BaseBlock from './blocks/BaseBlock'


export default class Input<T> {
  connectionSubscription: Subscription<Output<T> | null> = new Subscription(null)

  constructor(public name: string, public block: BaseBlock) {}

  connect(output: Output<T>) {
    this.connectionSubscription.value = output
    output.subscription.subscribe(this.block.onInputUpdate.bind(this.block))
  }

  get output(): Output<T> | null {
    return this.connectionSubscription.value
  }

  get value() {
    return this.output!.value
  }

  set value(newValue) {
    this.output!.value = newValue
  }
}
