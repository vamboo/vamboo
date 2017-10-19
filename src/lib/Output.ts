import * as _ from 'lodash'
import Subscription from './Subscription'


export default class Output<T> {
  instanceId = _.uniqueId(this.constructor.name)
  valueSubscription: Subscription<T>

  constructor(public name: string | null, initialValue: T) {
    this.valueSubscription = new Subscription(initialValue)
  }

  get value() {
    return this.valueSubscription.value
  }

  set value(newValue) {
    this.valueSubscription.value = newValue
  }
}
