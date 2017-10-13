import {ReactElement} from 'react'
import Observable from '../Observable'
import Input from '../Input'
import Output from '../Output'


// TypeScript does not support interface which includes static members and instance members...
export default abstract class BaseBlock {
  static blockName: string  // static property 'name' conflicts with Function.name
  // TypeScript does not support abstract static property...

  abstract inputs: Input<any>[]
  abstract outputs: Output<any>[]

  abstract onInputUpdate(): void
}

export abstract class FunctionBlock extends BaseBlock {}

export abstract class GUIElementBlock extends BaseBlock {
  // TODO
}

export abstract class SourceBlock extends BaseBlock {
  readonly inputs = []
}

export abstract class SinkBlock extends BaseBlock {
  readonly outputs = []
}
