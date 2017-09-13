import * as React from 'react';
import {storiesOf} from '@storybook/react';
import * as h from 'react-hyperscript'
import Input from '../src/lib/Input'
import Output from '../src/lib/Output'
import BaseBlock from '../src/lib/blocks/BaseBlock'
import InputProperty from '../src/components/InputProperty'
import InputProperties from '../src/components/InputProperties'


class DummyBlock extends BaseBlock {
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
