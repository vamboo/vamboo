import * as React from 'react'
import Subscription from '../Subscription'
import Input from '../Input'
import Output from '../Output'


// TypeScript does not support interface which includes static members and instance members...
export default abstract class BaseBlock {
  static blockName: string  // static property 'name' conflicts with Function.name
  // TypeScript does not support abstract static property...

  abstract inputs: Input<any>[]
  abstract outputs: Output<any>[]

  protected configure() {
    this.inputs.forEach(input => {
      input.valueSubscription.subscribe(this.onInputUpdate.bind(this))
    })
  }

  protected onInputUpdate() {}
}

export abstract class FunctionBlock extends BaseBlock {}

export abstract class GUIElementBlock extends BaseBlock {
  static drawer: React.ComponentClass
}

export abstract class SourceBlock extends BaseBlock {
  readonly inputs = []
}

export abstract class SinkBlock extends BaseBlock {
  readonly outputs = []
}
