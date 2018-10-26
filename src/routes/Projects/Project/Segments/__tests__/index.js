import React from 'react';
import test from 'ava';

import BreadcrumbItem from 'components/BreadcrumbItem';

import { Segments } from '../index';

const { expect, shallow } = testHelper;

const testProjectId = 'testProject';
const testProps = {
  formatMessage: () => 'something',
  match: { params: { projectId: testProjectId } },
};

const shallowRenderer = (props = testProps) =>
  shallow(<Segments {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb).toHaveProps({ to: `/projects/${testProjectId}/segments` });
});

test('Renders a Routes', () => {
  const component = shallowRenderer();
  expect(component).toContain('Routes');
});
