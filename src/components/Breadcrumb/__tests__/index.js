import React from 'react';
import test from 'ava';
import { Breadcrumbs } from 'react-breadcrumbs-dynamic';

import { Breadcrumb } from '../index';

const { expect, shallow } = testHelper;

const testProps = {};

const shallowRenderer = (props = testProps) =>
  shallow(<Breadcrumb {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a Breadcrumbs', () => {
  const component = shallowRenderer();
  expect(component).toContain(Breadcrumbs);
});

test('Renders a breadcrumbMenu', () => {
  const breadcrumbMenu = 'abc';
  const component = shallowRenderer({
    ...testProps,
    breadcrumbMenu,
  });
  expect(component.text()).toInclude(breadcrumbMenu);
});
