import * as _ from 'lodash'
import Input from './Input'
import Subscription from './Subscription'
import {PushPullFunctionBlock} from './blocks/BaseBlock'


export default class Output<T> {
  readonly id = _.uniqueId(this.constructor.name)
  input: Input<T> | null = null
  pushSubscription: Subscription<T>
  pullSubscription: Subscription<T>

  constructor(public name: string | null, initialValue: T, private willPropagateUpdate = true) {
    this.pushSubscription = new Subscription(initialValue)
    this.pullSubscription = new Subscription(initialValue)
  }

  isAnonymous() {
    return this.name === null
  }

  connect(input: Input<T>) {
    input.connect(this)
  }

  disconnect() {
    if (this.input !== null) {
      this.input.disconnect()
    }
  }

  isConnected() {
    return this.input !== null
  }

  push(value: T) {
    if (this.willPropagateUpdate) {
      this.pushSubscription.value = value
    } else {
      this.pushSubscription._value = value
    }
  }

  pull() {
    if (!this.willPropagateUpdate) {
      this.pullSubscription.value = this.pushSubscription.value
    }

    return this.pushSubscription.value
  }
}

export class LazyOutput<T> extends Output<T> {
  constructor(name: string | null, initialValue: T, public block: PushPullFunctionBlock<T>) {
    super(name, initialValue, true)
  }

  pull() {
    this.pullSubscription.value = this.block.pull()
    return this.pullSubscription.value
  }
}
