import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import BreadcrumbItem from 'components/BreadcrumbItem';
import HeaderTitle from 'components/HeaderTitle';

import { WorkflowCreate } from '../index';
import CreateWorkflowCard from '../components/CreateWorkflowCard';

const { expect, shallow } = testHelper;

const testProjectId = 'testProject';
const testProps = {
  formatMessage: () => 'something',
  match: { params: { projectId: testProjectId } },
  history: { push: noop },
};

const shallowRenderer = (props = testProps) =>
  shallow(<WorkflowCreate {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem', () => {
  const component = shallowRenderer();
  const breadcrumb = component.find(BreadcrumbItem);
  expect(breadcrumb).toHaveProps({ to: `/projects/${testProjectId}/workflows/new` });
});

test('Renders a HeaderTitle', () => {
  const component = shallowRenderer();
  expect(component).toContain(HeaderTitle);
});

test('Renders a CreateSegmentCard', () => {
  const component = shallowRenderer();
  expect(component).toContain(CreateWorkflowCard);
});
