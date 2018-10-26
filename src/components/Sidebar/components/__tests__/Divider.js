import React from 'react';
import test from 'ava';

import Divider from '../Divider';

const { expect, shallow } = testHelper;

const testProps = {};

const shallowRenderer = (props = testProps) =>
  shallow(<Divider {...props} />);

test('Renders a li', () => {
  const component = shallowRenderer();
  expect(component).toBeA('li');
});
