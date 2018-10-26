import React from 'react';
import test from 'ava';

import { UsersList } from '../index';

const { expect, shallow } = testHelper;

const testProps = {};

const shallowRenderer = (props = testProps) =>
  shallow(<UsersList {...props} />);

test('Renders a Redirect.', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Redirect');
  expect(component).toHaveProps({ to: '/users/me' });
});
