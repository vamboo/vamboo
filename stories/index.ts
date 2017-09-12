import * as React from 'react';
import {storiesOf} from '@storybook/react';
import * as h from 'react-hyperscript'
import UnderConstruction from '../src/components/UnderConstruction'


storiesOf('Button', module)
  .add('with text', () => h(UnderConstruction))
