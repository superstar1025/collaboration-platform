import React from 'react';
import test from 'ava';

import SidebarHeader from '../SidebarHeader';

const { expect, shallow } = testHelper;

const testProps = {
  picture: 'avatarUrl',
  name: 'testname',
  nickname: 'nickname',
};

const shallowRenderer = (props = testProps) =>
  shallow(<SidebarHeader {...props} />);

test('Renders a li', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});
