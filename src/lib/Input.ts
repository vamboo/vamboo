import Observer from './Observer'
import Output from './Output'
import BaseBlock from './blocks/BaseBlock'


export default class Input<T> {
  output?: Output<T>;

  constructor(public name: string, public block: BaseBlock) {}

  connect(output: Output<T>) {
    this.output = output
    output.observable.addObserver(this.block.update.bind(this.block))
  }
}
