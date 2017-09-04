import Observer from './Observer'
import Output from './Output'
import BaseBlock from './blocks/BaseBlock'


export default class Input<T> {
  output?: Output<T>;

  constructor(public name: string, public block: BaseBlock) {}

  connect(output: Output<T>) {
    this.output = output
    output.observable.addObserver(this.block.onInputUpdate.bind(this.block))
  }

  get value() {
    return this.output!.value
  }

  set value(newValue) {
    this.output!.value = newValue
  }
}
