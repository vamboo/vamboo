import Observable from '../Observable'
import {ReactElement} from 'react'


type JSType = object  // ugly

// TypeScript does not support interface which includes static members and instance members...
export default abstract class BaseBlock {
  static blockName: string  // static property 'name' conflicts with Function.name

  inputs: Input[]
  outputs: Output[]

  constructor() {  // subclasses must instantiate inputs/outputs here
    this.inputs = []
    this.outputs = []
  }

  abstract update(): void
}

export abstract class GUIBlock extends BaseBlock {
  constructor(private reactElement: ReactElement<any>) {  // call this.reactElement.setState from this.update
    super()
  }
}

export type FunctionBlock = BaseBlock
export type SourceBlock = BaseBlock
