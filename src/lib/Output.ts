import * as _ from 'lodash'
import Subscription from './Subscription'
import Input from './Input'


export default class Output<T> {
  instanceId = _.uniqueId(this.constructor.name)
  valueSubscription: Subscription<T>
  input: Input<T> | null = null

  constructor(public name: string | null, initialValue: T) {
    this.valueSubscription = new Subscription(initialValue)
  }

  connect(input: Input<T>) {
    input.connect(this)
  }

  disconnect() {
    if (this.input !== null) {
      this.input.disconnect()
    }
  }

  get value() {
    return this.valueSubscription.value
  }

  set value(newValue) {
    this.valueSubscription.value = newValue
  }
}
