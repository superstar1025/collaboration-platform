import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import NavDropdown from '../NavDropdown';

const { expect, shallow } = testHelper;

const testProps = {
  open: false,
  handleClick: noop,
  name: 'test',
  icon: 'testIcon',
  children: 'this is a children',
};

const shallowRenderer = (props = testProps) =>
  shallow(<NavDropdown {...props} />);

test('Renders a li', () => {
  const component = shallowRenderer();
  expect(component).toBeA('li');
});

test('Renders an i with proper icon', () => {
  const component = shallowRenderer();
  const icon = component.find('i');
  expect(icon).toHaveProps({ className: testProps.icon });
});

test('Renders a li with className open when prop open is true.', () => {
  const component = shallowRenderer({
    ...testProps,
    open: true,
  });
  expect(component).toHaveClass('open');
});
