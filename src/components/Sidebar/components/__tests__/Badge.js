import React from 'react';
import test from 'ava';
import { Badge as RsBadge } from 'reactstrap';

import Badge from '../Badge';

const { expect, shallow } = testHelper;

const testProps = {
  variant: 'red',
  text: 'test-text',
};

const shallowRenderer = (props = testProps) =>
  shallow(<Badge {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA(RsBadge);
});
