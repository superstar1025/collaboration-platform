import React from 'react';
import test from 'ava';
import { NavItem as RsNavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { noop } from 'lodash';

import NavItem from '../NavItem';
import Badge from '../Badge';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  name: 'item',
  icon: 'icon',
};

const shallowRenderer = (props = testProps) =>
  shallow(<NavItem {...props} />);

test('Renders a NavItem from reactstrap', () => {
  const component = shallowRenderer();
  expect(component).toBeA(RsNavItem);
});

test('Renders one NavLink', () => {
  const component = shallowRenderer();
  expect(component.find(NavLink).length).toBe(1);
});

test('only active when path is exactly same', () => {
  const component = shallowRenderer();
  const navLink = component.find(NavLink);
  expect(navLink.props().isActive()).toBe(false);
  expect(navLink.props().isActive({ isExact: true })).toBe(true);
});

test('Renders Badge when prop badge is defined', () => {
  const component = shallowRenderer({
    ...testProps,
    badge: {
      variant: 'red',
      text: 'test badge',
    },
  });
  expect(component.find(Badge).length).toBe(1);
});

test('handleClick is called when click NavLink', () => {
  const handleClick = createSpy();
  const component = shallowRenderer({
    ...testProps,
    handleClick,
  });
  const navLink = component.find(NavLink);
  const event = { preventDefault: noop };
  navLink.simulate('click', event);
  expect(handleClick).toHaveBeenCalledWith(event);
});

test('handleClick is not called even if NavLink is clicked when it is noop.', () => {
  const preventDefault = createSpy();
  const component = shallowRenderer({
    ...testProps,
    handleClick: noop,
  });
  const navLink = component.find(NavLink);
  const event = { preventDefault };
  navLink.simulate('click', event);
  expect(preventDefault).toNotHaveBeenCalled();
});

test('add class for variant when prop variant is set.', () => {
  const variant = 'whatever';
  const component = shallowRenderer({
    ...testProps,
    variant,
  });
  const navLink = component.find(NavLink);
  expect(navLink).toHaveClass(`nav-link-${variant}`);
});
