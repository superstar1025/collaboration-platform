import React from 'react';
import test from 'ava';
import { fromJS } from 'immutable';
import { noop } from 'lodash';

import { SidebarItems } from '../index';

const { expect, shallow, createSpy } = testHelper;

const testProps = {
  items: [{ name: 'a' }, { name: 'b' }],
  sidebarItems: fromJS([{ name: 'c' }, { name: 'd' }, { name: 'e' }]),
  setSidebarItems: noop,
};

const shallowRenderer = (props = testProps) =>
  shallow(<SidebarItems {...props} />);

test('Renders null', () => {
  const component = shallowRenderer();
  expect(component.node).toBe(null);
});

test('setSidebarItems is called with joined array when mount', () => {
  const setSidebarItems = createSpy();
  shallowRenderer({
    ...testProps,
    setSidebarItems,
  });
  const param = setSidebarItems.calls[0].arguments[0];
  expect(setSidebarItems).toHaveBeenCalled();
  expect(param).toEqual(testProps.items.concat(testProps.sidebarItems.toJS()));
});

test('setSidebarItems is called with original array when unmount', () => {
  const setSidebarItems = createSpy();
  const component = shallowRenderer({
    ...testProps,
    setSidebarItems,
  });
  component.unmount();
  const param = setSidebarItems.calls[1].arguments[0];
  expect(setSidebarItems).toHaveBeenCalled();
  expect(param).toEqual(testProps.sidebarItems.toJS().slice(testProps.items.length));
});

test('setSidebarItems is called when items passed are changed.', () => {
  const setSidebarItems = createSpy();
  const component = shallowRenderer();
  component.setProps({ items: [], setSidebarItems });
  expect(setSidebarItems).toHaveBeenCalled();
});

test('setSidebarItems is not called when props are changed but not items.', () => {
  const setSidebarItems = createSpy();
  const component = shallowRenderer();
  component.setProps({ setSidebarItems });
  expect(setSidebarItems).toNotHaveBeenCalled();
});
