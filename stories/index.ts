import * as React from 'react';
import {storiesOf} from '@storybook/react';
import * as h from 'react-hyperscript'
import Input from '../src/lib/Input'
import Output from '../src/lib/Output'
import BaseBlock from '../src/lib/blocks/BaseBlock'
import InputProperty from '../src/components/InputProperty'


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
