import * as _ from 'lodash'
import * as React from 'react'
import Subscription from '../Subscription'
import Input from '../Input'
import {default as Output, LazyOutput} from '../Output'


export enum BlockKinds {
  Source,
  Function,
  Sink,
  GUI,
  Begin,
  End
}

export default abstract class BaseBlock {
  static blockName: string
  static blockKind: BlockKinds

  inputs: Input<any>[] = []
  outputs: Output<any>[] = []
}

export abstract class PushFunctionBlock extends BaseBlock {
  static blockKind = BlockKinds.Function
}

export abstract class PushPullFunctionBlock<T> extends PushFunctionBlock {
  abstract outputs: [LazyOutput<T>]

  configure() {
    this.inputs.forEach(input => {
      input.valueSubscription.subscribe(this.push.bind(this))
    })
  }

  abstract pull(): T

  private push() {
    this.outputs[0].value = this.pull()
  }
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

  endBlock: EndBlock<any>

  connect(endBlock: EndBlock<any>) {
    this.endBlock = endBlock
  }
}

export abstract class EndBlock<T> extends BaseBlock {
  static blockKind = BlockKinds.End
  static beginBlockClass: typeof BeginBlock

  abstract inputs: [Input<T>]
  abstract outputs: [Output<T>]

  abstract pull(): T
}

export type BlockClass
  = typeof PushFunctionBlock
  | typeof PushPullFunctionBlock
  | typeof GUIElementBlock
  | typeof SourceBlock
  | typeof SinkBlock
  | typeof BeginBlock
  | typeof EndBlock
