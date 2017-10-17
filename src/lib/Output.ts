import Subscription from './Subscription'


export default class Output<T> {
  subscription: Subscription<T>

  constructor(public name: string | null, initialValue: T) {
    this.subscription = new Subscription(initialValue)
  }

  get value() {
    return this.subscription.value
  }

  set value(newValue) {
    this.subscription.value = newValue
  }
}
