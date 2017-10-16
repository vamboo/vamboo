import * as React from 'react';
import {storiesOf} from '@storybook/react';
import * as h from 'react-hyperscript'
import Input from '../src/lib/Input'
import Output from '../src/lib/Output'
import BaseBlock from '../src/lib/blocks/BaseBlock'
import InputProperty from '../src/components/InputProperty'
import InputProperties from '../src/components/InputProperties'
import OutputProperties from '../src/components/OutputProperties'
import Properties from '../src/components/Properties'
import Arrows from '../src/components/Arrows'


class DummyBlock extends BaseBlock {
  static blockName = 'Dummy'

  inputs: Input<number>[] = [new Input<number>('input1', this), new Input<number>('input2', this)]
  outputs = [new Output<number>('output1', 1)]

  onInputUpdate() {}
}


storiesOf('InputProperty', module)
  .add('not connected', () => h(InputProperty, {input: new Input<number>('input1', new DummyBlock)}))
  .add('connected', () => {
    const input = new Input<number>('input2', new DummyBlock)
    input.connect(new Output<number>('output2', 0))
    return h(InputProperty, {input})
  })

storiesOf('InputProperties', module)
  .add('foo', () => {
    const block = new DummyBlock
    const input1 = new Input<number>('input1', block)
    input1.connect(new Output<number>('output1', 0))
    const input2 = new Input<number>('input2', block)
    return h(InputProperties, {inputs: [input1, input2]})
  })

storiesOf('OutputProperties', module)
  .add('foo', () => h(OutputProperties, {outputs: [new Output('output1', 1), new Output('output2', 2)]}))

const TwoProperties = () => h('div', [
  h(Properties, {block: new DummyBlock}),
  h('div', {style: {position: 'absolute', left: 500}}, [
    h(Properties, {block: new DummyBlock})
  ])
])

storiesOf('Properties', module)
  .add('one', () => h(Properties, {block: new DummyBlock}))
  .add('two', () => h(TwoProperties))

storiesOf('Arrows', module)
  .add('hoge', () => h('div', [
    h(TwoProperties),
    h('div', {style: {'pointer-events': 'none', position: 'absolute', top: 0, left: 0}}, [
      h(Arrows)
    ])
  ]))
