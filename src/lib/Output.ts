import * as _ from 'lodash'
import Input from './Input'
import Subscription from './Subscription'
import {PushPullFunctionBlock} from './blocks/BaseBlock'


export default class Output<T> {
  readonly id = _.uniqueId(this.constructor.name)
  input: Input<T> | null = null
  willPropagateUpdate = true
  valueSubscription: Subscription<T>

  constructor(public name: string | null, initialValue: T) {
    this.valueSubscription = new Subscription(initialValue)
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

  pull() {
    return this.value
  }

  get value() {
    return this.valueSubscription.value
  }

  set value(newValue) {
    if (this.willPropagateUpdate) {
      this.valueSubscription.value = newValue
    } else {
      this.valueSubscription._value = newValue
    }
  }
}

export class LazyOutput<T> extends Output<T> {
  constructor(name: string | null, initialValue: T, public block: PushPullFunctionBlock<T>) {
    super(name, initialValue)
  }

  pull() {
    return this.block.pull()
  }
}
