import React from 'react';
import test from 'ava';

import { Companies } from '../index';

const { expect, shallow } = testHelper;

const testUserId = 'userId';

const testProps = {
  formatMessage: () => 'something',
  match: { params: { userId: testUserId } },
};

const shallowRenderer = (props = testProps) =>
  shallow(<Companies {...props} />);

test('Renders a div.', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem with a proper prop `to`.', () => {
  const component = shallowRenderer();
  const breadcrumbItem = component.find('BreadcrumbItem');
  expect(breadcrumbItem).toHaveProps({ to: '/companies' });
});
