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

export abstract class GUIBlock extends BaseBlock {
  constructor(private reactElement: ReactElement<any>) {  // call this.reactElement.setState from this.update
    super()
  }
}

export type FunctionBlock = BaseBlock
export type SourceBlock = BaseBlock
