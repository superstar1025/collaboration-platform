import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import DashboardCard from '../DashboardCard';

const { expect, shallow } = testHelper;

const testProps = {
  bgColor: 'test backcolor',
  type: 'type',
  count: 'count',
  actions: [
    { label: 'action1', onClick: noop },
    { label: 'action1', onClick: noop },
  ],
};

const shallowRenderer = (props = testProps) =>
  shallow(<DashboardCard {...props} />);

test('Renders a Card', () => {
  const component = shallowRenderer();
  expect(component).toBeA('Card');
});

test('Renders a ButtonGroup', () => {
  const component = shallowRenderer();
  expect(component).toContain('ButtonGroup');
});

test('Button dropdown toggles correctly.', () => {
  const component = shallowRenderer();
  expect(component).toHaveState({ showDropdown: false });
  component.find('ButtonDropdown').props().toggle();
  expect(component).toHaveState({ showDropdown: true });
});
