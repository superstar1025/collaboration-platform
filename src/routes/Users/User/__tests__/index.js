import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';

import SidebarItems from 'components/SidebarItems';

import { User } from '../index';

const { expect, shallow } = testHelper;

const testUserId = 'userId';
const testUserName = 'userName';
const testUserMeName = 'currentUserName';

const testProps = {
  formatMessage: () => 'something',
  match: { params: { userId: testUserId } },
  user: fromJS({ attributes: { name: testUserName } }),
  currentUser: fromJS({ name: testUserMeName }),
};

const shallowRenderer = (props = testProps) =>
  shallow(<User {...props} />);

test('Renders a div.', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders a BreadcrumbItem with a proper prop `to`.', () => {
  const component = shallowRenderer();
  const breadcrumbItem = component.find('BreadcrumbItem');
  expect(breadcrumbItem).toHaveProps({ to: `/users/${testUserId}` });
});

test('Renders a BreadcrumbItem with a proper text.', () => {
  const component = shallowRenderer({
    ...testProps,
    user: fromJS({ attributes: {} }),
  });
  const breadcrumbItem = component.find('BreadcrumbItem');
  expect(breadcrumbItem.props().children).toNotInclude(testUserName);
});

test('Renders a BreadcrumbItem with loading text when name is not yet ready.', () => {
  const component = shallowRenderer();
  let breadcrumbItem = component.find('BreadcrumbItem');
  expect(breadcrumbItem.props().children).toInclude(testUserName);
  component.setProps({ match: { params: { userId: 'me' } } });
  // when user id is me, breadcrumbItem should be 'me'
  breadcrumbItem = component.find('BreadcrumbItem');
  expect(breadcrumbItem.props().children).toInclude(testUserMeName);
});

test('Renders a Routes.', () => {
  const component = shallowRenderer();
  expect(component).toContain('Routes');
});

test('Renders a SidebarItems.', () => {
  const component = shallowRenderer();
  expect(component).toContain(SidebarItems);
});
