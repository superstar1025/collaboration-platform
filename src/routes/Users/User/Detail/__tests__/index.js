import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';

import HeaderTitle from 'components/HeaderTitle';

import { UserDetail } from '../index';

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
  shallow(<UserDetail {...props} />);

test('Renders a div.', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders the right userName.', () => {
  const component = shallowRenderer();
  let usernameDiv = component.find('div.username');
  expect(usernameDiv.props().children).toInclude(testUserName);
  // when user is me it should show the current user's name
  component.setProps({ match: { params: { userId: 'me' } } });
  usernameDiv = component.find('div.username');
  expect(usernameDiv.props().children).toInclude(testUserMeName);
});

test('Does not render userName when it is not loaded.', () => {
  const component = shallowRenderer({
    ...testProps,
    user: fromJS({ attributes: {} }),
  });
  const usernameDiv = component.find('div.username');
  expect(usernameDiv.props().children).toNotInclude(testUserName);
});

test('Renders a HeaderTitle.', () => {
  const component = shallowRenderer();
  expect(component).toContain(HeaderTitle);
});
