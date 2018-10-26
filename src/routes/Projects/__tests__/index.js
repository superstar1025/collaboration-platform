import React from 'react';
import test from 'ava';

import { Projects } from '../index';

const { expect, shallow } = testHelper;

const testProps = {
  formatMessage: () => 'something',
};

const shallowRenderer = (props = testProps) =>
  shallow(<Projects {...props} />);

test('Renders a div.', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem with a proper prop `to`.', () => {
  const component = shallowRenderer();
  const breadcrumbItem = component.find('BreadcrumbItem');
  expect(breadcrumbItem).toHaveProps({ to: '/projects' });
});

test('Renders a Routes.', () => {
  const component = shallowRenderer();
  expect(component).toContain('Routes');
});
