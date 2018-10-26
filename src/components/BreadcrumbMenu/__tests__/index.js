import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import { BreadcrumbMenu } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  setBreadcrumbMenu: noop,
  clearBreadcrumbMenu: noop,
  children: 'whatever',
};

const shallowRenderer = (props = testProps) =>
  shallow(<BreadcrumbMenu {...props} />);

test('Renders null', () => {
  const component = shallowRenderer();
  expect(component.node).toEqual(null);
});

test('Calls setBreadcrumbMenu with children', () => {
  const setBreadcrumbMenu = createSpy();
  shallowRenderer({
    ...testProps,
    setBreadcrumbMenu,
  });
  expect(setBreadcrumbMenu).toHaveBeenCalledWith(testProps.children);
});

test('Calls setBreadcrumbMenu when children is changed', () => {
  const setBreadcrumbMenu = createSpy();
  const newChildren = 'new children';
  const component = shallowRenderer();
  component.setProps({ children: newChildren, setBreadcrumbMenu });
  expect(setBreadcrumbMenu).toHaveBeenCalledWith(newChildren);
});

test('Does not call setBreadcrumbMenu when prop is changed but children is not changed.', () => {
  const setBreadcrumbMenu = createSpy();
  const component = shallowRenderer();
  component.setProps({ setBreadcrumbMenu });
  expect(setBreadcrumbMenu).toNotHaveBeenCalled();
});

test('Calls clearBreadcrumbMenu when unmounted', () => {
  const clearBreadcrumbMenu = createSpy();
  const component = shallowRenderer({
    ...testProps,
    clearBreadcrumbMenu,
  });
  component.unmount();
  expect(clearBreadcrumbMenu).toHaveBeenCalled();
});
