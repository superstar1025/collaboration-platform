import React from 'react';
import test from 'ava';

import Title from '../Title';

const { expect, shallow } = testHelper;

const testProps = {
  name: 'title',
};

const shallowRenderer = (props = testProps) =>
  shallow(<Title {...props} />);

test('Renders a li', () => {
  const component = shallowRenderer();
  expect(component).toBeA('li');
});
