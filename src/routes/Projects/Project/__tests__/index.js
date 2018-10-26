import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';
import { noop } from 'lodash';

import SidebarItems from 'components/SidebarItems';

import { Project } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProjectId = 'testProjectId';
const testProjectName = 'test Project';
const testProps = {
  formatMessage: () => 'something',
  match: { params: { projectId: testProjectId } },
  readProject: noop,
  project: fromJS({ attributes: { name: testProjectName } }),
};

const shallowRenderer = (props = testProps) =>
  shallow(<Project {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem with a proper prop `to`.', () => {
  const component = shallowRenderer();
  const breadcrumbItem = component.find('BreadcrumbItem');
  expect(breadcrumbItem).toHaveProps({ to: `/projects/${testProjectId}` });
});

test('Renders a SidebarItems.', () => {
  const component = shallowRenderer();
  expect(component).toContain(SidebarItems);
});

test('Renders a Routes.', () => {
  const component = shallowRenderer();
  expect(component).toContain('Routes');
});

test('readProject is called with proper param.', () => {
  const readProject = createSpy();
  shallowRenderer({
    ...testProps,
    readProject,
  });
  expect(readProject).toHaveBeenCalled(testProjectId);
});

test('BreadCrumbItem has project name when there is attributes name', () => {
  const component = shallowRenderer();
  const breadCrumbItem = component.find('BreadcrumbItem');
  expect(breadCrumbItem.props().children).toInclude(testProjectName);
});

test('BreadCrumbItem does not have a project name when there is not an attributes name', () => {
  const component = shallowRenderer({
    ...testProps,
    project: fromJS({}),
  });
  const breadCrumbItem = component.find('BreadcrumbItem');
  expect(breadCrumbItem.props().children).toNotInclude(testProjectName);
});
