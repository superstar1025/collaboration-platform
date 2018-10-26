import React from 'react';
import test from 'ava';

import NotificationCard from '../index';

const { expect, shallow } = testHelper;

const testProps = {
  title: 'testTitle',
  description: 'testDescription',
};

const shallowRenderer = (props = testProps) =>
  shallow(<NotificationCard {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});
