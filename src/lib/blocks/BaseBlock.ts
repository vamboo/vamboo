import * as React from 'react'
import Subscription from '../Subscription'
import Input from '../Input'
import Output from '../Output'


export enum BlockKinds {
  Source,
  Function,
  Sink,
  GUI,
  Begin,
  End
}

// TypeScript does not support interface which includes static members and instance members...
export default abstract class BaseBlock {
  static blockName: string  // static property 'name' conflicts with Function.name
  static blockKind: BlockKinds
  // TypeScript does not support abstract static property...

  abstract inputs: Input<any>[]
  abstract outputs: Output<any>[]

  protected configure() {
    this.inputs.forEach(input => {
      input.connectionSubscription.subscribe(this.onInputUpdate.bind(this))
      input.valueSubscription.subscribe(this.onInputUpdate.bind(this))
    })
  }

  protected onInputUpdate() {}
}

export abstract class FunctionBlock extends BaseBlock {
  static blockKind = BlockKinds.Function
}

export abstract class GUIElementBlock extends BaseBlock {
  static blockKind = BlockKinds.GUI
  static drawer: React.ComponentClass
}

export abstract class SourceBlock extends BaseBlock {
  static blockKind = BlockKinds.Source
  readonly inputs = []
}

export abstract class SinkBlock extends BaseBlock {
  static blockKind = BlockKinds.Sink
  readonly outputs = []
}

export abstract class BeginBlock extends BaseBlock {
  static blockKind = BlockKinds.Begin
  static endBlockClass: typeof EndBlock

  endBlock: EndBlock

  connect(endBlock: EndBlock) {
    this.endBlock = endBlock
  }
}

export abstract class EndBlock extends BaseBlock {
  static blockKind = BlockKinds.End
  static beginBlockClass: typeof BeginBlock
}

export type BlockClass
  = typeof FunctionBlock
  | typeof GUIElementBlock
  | typeof SourceBlock
  | typeof SinkBlock
  | typeof BeginBlock
  | typeof EndBlock
