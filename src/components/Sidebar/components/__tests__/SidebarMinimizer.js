import React from 'react';
import test from 'ava';

import SidebarMinimizer from '../SidebarMinimizer';

const { expect, shallow, createSpy } = testHelper;

const testProps = {};

const shallowRenderer = (props = testProps) =>
  shallow(<SidebarMinimizer {...props} />);

test('Renders a button', () => {
  const component = shallowRenderer();
  expect(component).toBeA('button');
});

test('body classes() are toggled when button is clicked.', () => {
  const toggle = createSpy();
  document.body.classList.toggle = toggle;
  const component = shallowRenderer();
  component.simulate('click');
  expect(toggle).toHaveBeenCalledWith('sidebar-minimized');
  expect(toggle).toHaveBeenCalledWith('brand-minimized');
});
