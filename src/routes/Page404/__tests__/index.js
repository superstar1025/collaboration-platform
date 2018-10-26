import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import { Page404 } from '../index';

const { expect, shallow } = testHelper;

const testProps = {
  formatMessage: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<Page404 {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});
