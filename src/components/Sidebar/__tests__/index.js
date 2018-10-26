import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';
import { noop } from 'lodash';

import { Sidebar } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  sidebarItems: fromJS([
    { name: 'a', title: true },
    { name: 'b', divider: true },
    {
      name: 'c',
      icon: 'c-icon',
      url: '/matching-pathname',
      children: [
        { name: 'ca', icon: 'ca-icon' },
        { name: 'cb', icon: 'cb-icon' },
        { icon: 'cc-icon' },
      ],
    },
    { name: 'd', icon: 'd-icon' },
    { name: 'e', icon: 'e-icon' },
  ]),
  location: {
    pathname: '/not-matching',
  },
};

const shallowRenderer = (props = testProps) =>
  shallow(<Sidebar {...props} />);

test('Renders a div', () => {
  const component = shallowRenderer();
  expect(component).toBeA('div');
});

test('Renders one Title', () => {
  const component = shallowRenderer();
  expect(component.find('Title').length).toBe(1);
});

test('Renders one Divider', () => {
  const component = shallowRenderer();
  expect(component.find('Divider').length).toBe(1);
});

test('Renders one NavDropdown', () => {
  const component = shallowRenderer();
  expect(component.find('NavDropdown').length).toBe(1);
});

test('toggle className open when handleClick is called', () => {
  const component = shallowRenderer();
  const navDropdown = component.find('NavDropdown');
  const toggle = createSpy();
  navDropdown.props().handleClick({
    preventDefault: noop,
    target: { parentElement: { classList: { toggle } } },
  });
  expect(toggle).toHaveBeenCalledWith('open');
});

test('Renders 5 NavItem', () => {
  const component = shallowRenderer();
  expect(component.find('NavItem').length).toBe(5);
});

test('NavDropdown is open when url matches', () => {
  const component = shallowRenderer({
    ...testProps,
    location: {
      pathname: '/matching-pathname',
    },
  });
  const navDropdown = component.find('NavDropdown');
  expect(navDropdown).toHaveProps({ open: true });
});

test('NavDropdown is open when url does not match', () => {
  const component = shallowRenderer({
    ...testProps,
    location: {
      pathname: '/not-matching',
    },
  });
  const navDropdown = component.find('NavDropdown');
  expect(navDropdown).toHaveProps({ open: false });
});
