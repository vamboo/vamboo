import * as _ from 'lodash'
import Subscriber from './Subscriber'


export default class Subscription<T> {
  private subscribers: Subscriber<T>[] = []

  constructor(public _value: T) {}

  subscribe(subscriber: Subscriber<T>) {
    this.subscribers.push(subscriber)
  }

  unsubscribe(subscriber: Subscriber<T>) {
    _.pull(this.subscribers, subscriber)
  }

  notify() {
    this.subscribers.forEach(subscriber => {
      subscriber(this)
    })
  }

  get value() {
    return this._value
  }

  set value(newValue) {
    this._value = newValue
    this.notify()
  }
}
