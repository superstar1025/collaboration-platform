import React from 'react';
import test from 'ava';
import { noop } from 'lodash';

import { HeaderTitle } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  setHeaderTitle: noop,
  clearHeaderTitle: noop,
  children: 'whatever',
};

const shallowRenderer = (props = testProps) =>
  shallow(<HeaderTitle {...props} />);

test('Renders null', () => {
  const component = shallowRenderer();
  expect(component.node).toEqual(null);
});

test('Calls setHeaderTitle with children', () => {
  const setHeaderTitle = createSpy();
  shallowRenderer({
    ...testProps,
    setHeaderTitle,
  });
  expect(setHeaderTitle).toHaveBeenCalledWith(testProps.children);
});

test('Calls setHeaderTitle when children is changed', () => {
  const setHeaderTitle = createSpy();
  const newChildren = 'new children';
  const component = shallowRenderer();
  component.setProps({ children: newChildren, setHeaderTitle });
  expect(setHeaderTitle).toHaveBeenCalledWith(newChildren);
});

test('Does not call setHeaderTitle when prop is changed but children is not changed.', () => {
  const setHeaderTitle = createSpy();
  const component = shallowRenderer();
  component.setProps({ setHeaderTitle });
  expect(setHeaderTitle).toNotHaveBeenCalled();
});

test('Calls clearHeaderTitle when unmounted', () => {
  const clearHeaderTitle = createSpy();
  const component = shallowRenderer({
    ...testProps,
    clearHeaderTitle,
  });
  component.unmount();
  expect(clearHeaderTitle).toHaveBeenCalled();
});
