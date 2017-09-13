import Observer from './Observer'
import Output from './Output'
import BaseBlock from './blocks/BaseBlock'
import Observable from './Observable'


export default class Input<T> {
  connectionObservable: Observable<Output<T> | null> = new Observable(null)

  constructor(public name: string, public block: BaseBlock) {}

  connect(output: Output<T>) {
    this.connectionObservable.value = output
    output.observable.addObserver(this.block.onInputUpdate.bind(this.block))
  }

  get output(): Output<T> | null {
    return this.connectionObservable.value
  }

  get value() {
    return this.output!.value
  }

  set value(newValue) {
    this.output!.value = newValue
  }
}
